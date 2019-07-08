import { Method, AxiosInstance } from "axios";
import { NodeClient } from "@sentry/node";
import Ratelimiter from "./Ratelimiter";
interface TOptions {
    sentry: NodeClient | null;
    token: string;
    baseHost: string;
}
/**
 * Request Handler class
 * @private
 */
declare class RequestHandler {
    sentry: NodeClient | null;
    latency: number;
    remaining: Object;
    reset: Object;
    limit: Object;
    client: AxiosInstance;
    options: {
        baseURL: string;
        baseHost: string;
    };
    ratelimiter: Ratelimiter;
    /**
     * Create a new request handler
     * @param {Ratelimiter} ratelimiter - ratelimiter to use for ratelimiting requests
     * @param {Object} options - options
     * @param {String} options.token - token to use for calling the rest api
     * @constructor
     * @private
     */
    constructor(ratelimiter: Ratelimiter, options: TOptions);
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
    request<T>(endpoint: string, method: Method, dataType?: "json" | "multipart", data?: {}, attempts?: number): Promise<T>;
    /**
     * Calculate the time difference between the local server and discord
     * @param {String} dateHeader - Date header value returned by discord
     * @returns {number} - Offset in milliseconds
     * @private
     */
    private _getOffsetDateFromHeader;
    /**
     * Apply the received ratelimit headers to the ratelimit bucket
     * @param {LocalBucket} bkt - Ratelimit bucket to apply the headers to
     * @param {Object} headers - Http headers received from discord
     * @param {Number} offsetDate - Unix timestamp of the current date + offset to discord time
     * @param {Boolean} reactions - Whether to use reaction ratelimits (1/250ms)
     * @private
     */
    private _applyRatelimitHeaders;
    /**
     * Execute a normal json request
     * @param {String} endpoint - Endpoint to use
     * @param {String} method - Http Method to use
     * @param {Object} data - Data to send
     * @param {Boolean} useParams - Whether to send the data in the body or use query params
     * @returns {Promise<Object>} - Result of the request
     * @private
     */
    private _request;
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
    private _multiPartRequest;
}
export default RequestHandler;
//# sourceMappingURL=RequestHandler.d.ts.map