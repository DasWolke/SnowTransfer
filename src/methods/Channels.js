const Endpoints = require('../Endpoints');
const Constants = require('../Constants');

/**
 * Methods for interacting with Channels and Messages
 */
class ChannelMethods {
    /**
     * Create a new Channel Method handler
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     * @param {Object} options - options
     * @constructor
     */
    constructor(requestHandler, options) {
        this.requestHandler = requestHandler;
        this.options = options;
    }

    async getChannel(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL(channelId), 'get', 'json');
    }

    async updateChannel(channelId, data) {
        return this.requestHandler.request(Endpoints.CHANNEL(channelId), 'patch', 'json', data);
    }

    async deleteChannel(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL(channelId), 'delete', 'json');
    }

    async getChannelMessages(channelId, options = {}) {
        if (options.around) {
            delete options.before;
            delete options.after;
        } else if (options.before) {
            delete options.around;
            delete options.after;
        } else if (options.after) {
            delete options.before;
            delete options.around;
        }
        if (options.limit > Constants.GET_CHANNEL_MESSAGES_MAX_RESULTS) {
            throw new Error(`The maximum amount of messages that may be requested is ${Constants.GET_CHANNEL_MESSAGES_MAX_RESULTS}`);
        }
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), 'get', 'json', options);
    }

    async getChannelMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), 'get', 'json');
    }


    /**
     * Creates a new Message within a channel
     * @param {String} channelId - Id of the Channel to sent a message to
     * @param {Object|String} data - Data to send
     * @param {String} [data.content] - Content of the message
     * @param {Object} [data.embed] - Embed to send
     * @param {Object} [data.file] - File, that should be uploaded
     * @param {String} [data.file.name] - Name of the file
     * @param {File} [data.file.file] - Stream of the file
     * @returns {Promise.<Object>} - Returns a [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) object on success
     */
    async createMessage(channelId, data) {
        if (typeof data !== 'string' && !data.content && !data.embed && !data.file) {
            throw new Error('Missing content or embed');
        }
        if (typeof data === 'string') {
            return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), 'post', 'json', {content: data});
        } else if (data.file) {
            return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), 'post', 'multipart', data);
        } else {
            return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), 'post', 'json', data);
        }
    }

    async editMessage(channelId, messageId, data) {
        if (typeof data !== 'string' && !data.content && !data.embed) {
            throw new Error('Missing content or embed');
        }
        if (typeof data === 'string') {
            return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), 'patch', 'json', {content: data});
        } else {
            return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), 'patch', 'json', data);
        }
    }

    async deleteMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), 'delete', 'json');
    }

    async bulkDeleteMessages(channelId, messages) {
        if (messages.length < Constants.BULK_DELETE_MESSAGES_MIN || messages.length > Constants.BULK_DELETE_MESSAGES_MAX) {
            throw new Error(`Amount of messages to be deleted has to be between ${Constants.BULK_DELETE_MESSAGES_MIN} and ${Constants.BULK_DELETE_MESSAGES_MAX}`);
        }
        // TODO add check for id date, to make sure that ids can not be older than 2 weeks
        return this.requestHandler.request(Endpoints.CHANNEL_BULK_DELETE(channelId), 'post', 'json', messages);
    }

    async createReaction(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, '@me'), 'put', 'json');
    }

    async deleteReaction(channelId, messageId, emoji, userId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, userId), 'delete', 'json');
    }

    async getReactions(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emoji), 'get', 'json');
    }

    async deleteAllReactions(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTIONS(channelId, messageId), 'delete', 'json');
    }

    async editChannelPermissions(channelId, permissionId, data) {
        return this.requestHandler.request(Endpoints.CHANNEL_PERMISSION(channelId, permissionId), 'put', 'json', data);
    }

}

module.exports = ChannelMethods;