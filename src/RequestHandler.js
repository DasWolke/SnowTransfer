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
            headers: {Authorization: options.token, 'User-Agent': `DiscordBot (no github repo yet :<, ${version})`}
        });
    }

    async request(endpoint, method, dataType, data) {
        let request;
        try {
            switch (dataType) {
                case 'json':
                    request = await this._request(endpoint, method, data);
                    break;
                case 'multipart':
                    request = await this._multiPartRequest(endpoint, method, data);
                    break;
                default:
                    break;
            }
            if (request.data) {
                return request.data;
            }
            return Promise.resolve();
        } catch (error) {
            if (error.response) {
                throw new Error(error.response);
            } else if (error.request) {
                throw new Error(error.request);
            }
            throw error;
        }
    }

    async _request(endpoint, method, data) {
        if (method === 'get') {
            return this.client({url: endpoint, method, params: data});
        } else {
            return this.client({url: endpoint, method, data});
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