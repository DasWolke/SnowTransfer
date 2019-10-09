const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with voice stuff via rest
 */
class VoiceMethods {
    /**
     * Create a new Voice Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.voice.method`, where `client` is an initialized SnowTransfer instance
     * @param {import("../RequestHandler")} requestHandler - request handler that calls the rest api
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get currently available voice regions that can be used when creating servers
     * @returns {Promise<VoiceRegion[]>} Array of [voice region](https://discordapp.com/developers/docs/resources/voice#voice-region-object) objects
     */
    async getVoiceRegions() {
        return this.requestHandler.request(Endpoints.VOICE_REGIONS, 'get', 'json');
    }
}

/**
 * @typedef {object} VoiceRegion
 * @property {string} id - id of the region
 * @property {string} name - name of the region
 * @property {string} sample_hostname - example hostname of the region
 * @property {number} sample_port - example port of the region
 * @property {Boolean} vip - if this is a vip region
 * @property {Boolean} optimal - if this region is closest to the user
 * @property {Boolean} deprecated - if this region should not be used anymore
 * @property {Boolean} custom - if this is a custom region (used for events/etc)
 */

module.exports = VoiceMethods;
