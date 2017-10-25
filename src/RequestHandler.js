const axios = require('axios');
const Endpoints = require('./Endpoints');
const version = require('../package.json').version;
const FormData = require('form-data');

/**
 * Request Handler class
 */
class RequestHandler {
    /**
     * Create a new request handler
     * @param {Ratelimiter} ratelimiter - ratelimiter to use for ratelimiting requests
     * @param {Object} options - options
     * @param {String} options.token - token to use for calling the rest api
     * @constructor
     */
    constructor(ratelimiter, options) {
        this.ratelimiter = ratelimiter;
        this.client = axios.create({
            baseURL: Endpoints.BASE_HOST + Endpoints.BASE_URL,
            headers: {
                Authorization: options.token,
                'User-Agent': `DiscordBot (https://github.com/DasWolke/SnowTransfer, ${version})`
            }
        });
        this.latency = 500;
        this.remaining = {};
        this.reset = {};
        this.limit = {};
    }


    request(endpoint, method, dataType, data, attempts = 0) {
        return new Promise(async (res, rej) => {
            this.ratelimiter.queue(async (bkt) => {
                let request;
                let latency = Date.now();
                try {
                    switch (dataType) {
                        case 'json':
                            request = await this._request(endpoint, method, data, endpoint.includes('/bans'));
                            break;
                        case 'multipart':
                            request = await this._multiPartRequest(endpoint, method, data);
                            break;
                        default:
                            break;
                    }
                    this.latency = Date.now() - latency;
                    let offsetDate = this.getOffsetDateFromHeader(request.headers['date']);
                    this.applyRatelimitHeaders(bkt, request.headers, offsetDate, endpoint.endsWith('/reactions/:id'));
                    if (request.data) {
                        return res(request.data);
                    }
                    return res();
                } catch (error) {
                    if (attempts === 3) {
                        return rej({error: 'Request failed after 3 attempts', request: error});
                    }
                    if (error.response) {
                        let offsetDate = this.getOffsetDateFromHeader(error.response.headers['date']);
                        if (error.response.status === 429) {
                            //TODO WARN ABOUT THIS :< either bug or meme
                            this.applyRatelimitHeaders(bkt, error.response.headers, offsetDate, endpoint.endsWith('/reactions/:id'));
                            return this.request(endpoint, method, dataType, data, attempts ? ++attempts : 1);
                        }
                        if (error.response.status === 502) {
                            return this.request(endpoint, method, dataType, data, attempts ? ++attempts : 1);
                        }
                        return rej(error);
                    }
                    return rej(error);
                }
            }, endpoint, method);
        });

    }

    getOffsetDateFromHeader(dateHeader) {
        let discordDate = Date.parse(dateHeader);
        let offset = Date.now() - discordDate;
        return Date.now() + offset;
    }

    applyRatelimitHeaders(bkt, headers, offsetDate, reactions = false) {
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

    async _request(endpoint, method, data, useParams = false) {
        let headers = {};
        if (data.reason) {
            headers['X-Audit-Log-Reason'] = data.reason;
            delete data.reason;
        }
        if (useParams) {
            return this.client({url: endpoint, method, params: data, headers});
        } else {
            return this.client({url: endpoint, method, data, headers});
        }
    }

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
        formData.append('json_payload', JSON.stringify(data));
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