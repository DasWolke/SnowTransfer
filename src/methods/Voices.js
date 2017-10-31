const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with voice stuff via rest
 */
class VoiceMethods {
    /**
     * Create a new Voice Method Handler
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get currently available voice regions that can be used when creating servers
     * @returns {Promise.<Array>} Array of [voice region](https://discordapp.com/developers/docs/resources/voice#voice-region-object) objects
     */
    async getVoiceRegions() {
        return this.requestHandler.request(Endpoints.VOICE_REGIONS, 'get', 'json');
    }
}

module.exports = VoiceMethods;