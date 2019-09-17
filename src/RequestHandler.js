const EventEmitter = require('events');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const axios = require('axios');
const Endpoints = require('./Endpoints');
const version = require('../package.json').version;
const FormData = require('form-data');

/**
 * Request Handler class
 * @private
 */
class RequestHandler extends EventEmitter {
    /**
     * Create a new request handler
     * @param {Ratelimiter} ratelimiter - ratelimiter to use for ratelimiting requests
     * @param {Object} options - options
     * @param {String} options.token - token to use for calling the rest api
     * @constructor
     * @private
     */
    constructor(ratelimiter, options) {
        super();

        this.ratelimiter = ratelimiter;
        this.options = {baseHost: Endpoints.BASE_HOST, baseURL: Endpoints.BASE_URL};
        Object.assign(this.options, options);
        this.client = axios.create({
            baseURL: this.options.baseHost + Endpoints.BASE_URL,
            headers: {
                Authorization: options.token,
                'User-Agent': `DiscordBot (https://github.com/DasWolke/SnowTransfer, ${version})`
            },
            httpAgent: new http.Agent({ keepAlive: true }),
            httpsAgent: new https.Agent({ keepAlive: true })
        });
        this.raven = options.raven ? options.raven : null;
        this.latency = 500;
        this.remaining = {};
        this.reset = {};
        this.limit = {};
    }

    /**
     * Request a route from the discord api
     * @param {String} endpoint - endpoint to request
     * @param {String} method - http method to use
     * @param {String} [dataType=json] - type of the data being sent
     * @param {Object} [data] - data to send, if any
     * @param {Number} [attempts=0] - Number of attempts of the current request
     * @returns {Promise.<Object>} - Result of the request
     * @protected
     */
    request(endpoint, method, dataType = 'json', data = {}, attempts = 0) {
        return new Promise(async (res, rej) => {
            this.ratelimiter.queue(async (bkt) => {
                const reqID = crypto.randomBytes(20).toString('hex');
                let request;
                let latency = Date.now();
                try {
                    this.emit('request', reqID, { endpoint, method, dataType, data, attempts });

                    switch (dataType) {
                        case 'json':
                            request = await this._request(endpoint, method, data, (method === 'get' || endpoint.includes('/bans') || endpoint.includes('/prune')));
                            break;
                        case 'multipart':
                            request = await this._multiPartRequest(endpoint, method, data);
                            break;
                        default:
                            break;
                    }
                    this.latency = Date.now() - latency;
                    let offsetDate = this._getOffsetDateFromHeader(request.headers['date']);
                    this._applyRatelimitHeaders(bkt, request.headers, offsetDate, endpoint.endsWith('/reactions/:id'));

                    this.emit('done', reqID, request);
                    if (request.data) {
                        return res(request.data);
                    }
                    return res();
                } catch (error) {
                    this.emit('requestError', reqID, error);
                    if (this.raven) {
                        this.raven.captureException(error, {
                            extra: {
                                route: endpoint,
                                method,
                                status: error.response ? error.response.status : null,
                                statusText: error.response ? error.response.statusText : null,
                                response: error.response ? error.response.data : null
                            }
                        });
                    }
                    if (attempts === 3) {
                        return rej({error: 'Request failed after 3 attempts', request: error});
                    }
                    if (error.response) {
                        let offsetDate = this._getOffsetDateFromHeader(error.response.headers['date']);
                        if (error.response.status === 429) {
                            //TODO WARN ABOUT THIS :< either bug or meme
                            this._applyRatelimitHeaders(bkt, error.response.headers, offsetDate, endpoint.endsWith('/reactions/:id'));
                            return this.request(endpoint, method, dataType, data, attempts ? ++attempts : 1);
                        }
                        if (error.response.status === 502) {
                            return this.request(endpoint, method, dataType, data, attempts ? ++attempts : 1);
                        }
                    }
                    return rej(error);
                }
            }, endpoint, method);
        });

    }

    /**
     * Calculate the time difference between the local server and discord
     * @param {String} dateHeader - Date header value returned by discord
     * @returns {number} - Offset in milliseconds
     * @private
     */
    _getOffsetDateFromHeader(dateHeader) {
        let discordDate = Date.parse(dateHeader);
        let offset = Date.now() - discordDate;
        return Date.now() + offset;
    }

    /**
     * Apply the received ratelimit headers to the ratelimit bucket
     * @param {LocalBucket} bkt - Ratelimit bucket to apply the headers to
     * @param {Object} headers - Http headers received from discord
     * @param {Number} offsetDate - Unix timestamp of the current date + offset to discord time
     * @param {Boolean} reactions - Whether to use reaction ratelimits (1/250ms)
     * @private
     */
    _applyRatelimitHeaders(bkt, headers, offsetDate, reactions = false) {
        if (headers['x-ratelimit-global']) {
            bkt.ratelimiter.global = true;
            bkt.ratelimiter.globalReset = parseInt(headers['retry_after']);
        }
        if (headers['x-ratelimit-reset']) {
            let reset = (headers['x-ratelimit-reset'] * 1000) - offsetDate;
            if (reactions) {
                bkt.reset = Math.max(reset, 250);
            } else {
                bkt.reset = reset;
            }
        }
        if (headers['x-ratelimit-remaining']) {
            bkt.remaining = parseInt(headers['x-ratelimit-remaining']);
        } else {
            bkt.remaining = 1;
        }
        if (headers['x-ratelimit-limit']) {
            bkt.limit = parseInt(headers['x-ratelimit-limit']);
        }

    }

    /**
     * Execute a normal json request
     * @param {String} endpoint - Endpoint to use
     * @param {String} method - Http Method to use
     * @param {Object} data - Data to send
     * @param {Boolean} useParams - Whether to send the data in the body or use query params
     * @returns {Promise.<Object>} - Result of the request
     * @private
     */
    async _request(endpoint, method, data, useParams = false) {
        let headers = {};
        if (data.reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(data.reason);
            delete data.reason;
        }
        if (useParams) {
            return this.client({url: endpoint, method, params: data, headers});
        } else {
            return this.client({url: endpoint, method, data, headers});
        }
    }

    /**
     * Execute a multipart/form-data request
     * @param {String} endpoint - Endpoint to use
     * @param {String} method - Http Method to use
     * @param {Object} data - data to send
     * @param {Object} [data.file] - file to attach
     * @param {String} [data.file.name] - name of the file
     * @param {Buffer} [data.file.file] - Buffer with the file content
     * @returns {Promise.<Object>} - Result of the request
     * @private
     */
    async _multiPartRequest(endpoint, method, data) {
        let formData = new FormData();
        if (data.file.file) {
            if (data.file.name) {
                formData.append('file', data.file.file, {filename: data.file.name});
            } else {
                formData.append('file', data.file.file);
            }

            delete data.file.file;
        }
        formData.append('payload_json', JSON.stringify(data));
        // :< axios is mean sometimes
        return this.client({
            url: endpoint,
            method,
            data: formData,
            headers: {'Content-Type': `multipart/form-data; boundary=${formData._boundary}`}
        });
    }
}

module.exports = RequestHandler;
