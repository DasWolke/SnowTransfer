const Endpoints = require('../Endpoints');
const Constants = require('../Constants');

/**
 * Methods for interacting with Channels and Messages
 */
class ChannelMethods {
    /**
     * Create a new Channel Method handler
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     * @constructor
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get a channel via id
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Object>} - [discord channel](https://discordapp.com/developers/docs/resources/channel#channel-object) object
     */
    async getChannel(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL(channelId), 'get', 'json');
    }

    /**
     * Update a channel
     * @param {String} channelId - Id of the channel
     * @param {Object} data - Data to send
     * @param {String} [data.name] - New name of the channel
     * @param {Number} [data.position] - New position of the channel
     * @param {String} [data.topic] - New topic of the channel
     * @param {Boolean} [data.nsfw] - Update nsfw type of the channel
     * @param {Number} [data.bitrate] - Update bitrate of the channel
     * @param {Number} [data.user_limit] - Update the limit of users that are allowed to be in a channel
     * @param {Array} [data.permission_overwrites] - Update the permission overwrites
     * @param {String} [data.parent_id] - Id of the parent category of the channel
     * @returns {Promise.<Object>} - [discord channel](https://discordapp.com/developers/docs/resources/channel#channel-object) object
     */
    async updateChannel(channelId, data) {
        return this.requestHandler.request(Endpoints.CHANNEL(channelId), 'patch', 'json', data);
    }

    /**
     * Delete a channel via id
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Object>} - [discord channel](https://discordapp.com/developers/docs/resources/channel#channel-object) object
     */
    async deleteChannel(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL(channelId), 'delete', 'json');
    }

    /**
     * Get a list of channel messages from a channel
     * @param {String} channelId - id of the channel
     * @param {Object} [options]
     * @param {String} [options.around] - Get's messages around the id of the passed snowflake
     * @param {String} [options.before] - Get's messages before the id of the passed snowflake
     * @param {String} [options.after] - Get's messages after the id of the passed snowflake
     * @param {Number} [options.limit=50] - Number of messages to get, values between 1-100 allowed
     * @returns {Promise.<Array>} Array of [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) objects
     */
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

    /**
     * Get a single message via id
     * @param {String} channelId - id of the channel
     * @param {String} messageId - id of the message
     * @returns {Promise.<Object>} - [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) object
     */
    async getChannelMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), 'get', 'json');
    }


    /**
     * Creates a new Message within a channel
     * @param {String} channelId - Id of the Channel to sent a message to
     * @param {Object|String} data - Data to send
     * @param {String} [data.content] - Content of the message
     * @param {Boolean} [data.tts] - if this message is text-to-speech
     * @param {Object} [data.embed] - Embed to send
     * @param {Object} [data.file] - File, that should be uploaded
     * @param {String} [data.file.name] - Name of the file
     * @param {File} [data.file.file] - Buffer with file contents
     * @returns {Promise.<Object>} - [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) object
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

    /**
     * Edit a message sent by the current user
     * @param {String} channelId - id of the channel
     * @param {String} messageId - id of the message
     * @param {Object|String} data - Data to send
     * @param {String} [data.content] - Content of the message
     * @param {Object} [data.embed] - Embed to send
     * @returns {Promise.<Object>} [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) object
     */
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

    /**
     * Delete a message
     * @param {String} channelId - id of the channel
     * @param {String} messageId - id of the message
     * @returns {Promise}
     */
    async deleteMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), 'delete', 'json');
    }

    /**
     * Bulk delete messages, messages may not be older than 2 weeks
     * @param {String} channelId - id of the channel
     * @param {String[]} messages - array of message ids to delete
     * @returns {Promise}
     */
    async bulkDeleteMessages(channelId, messages) {
        if (messages.length < Constants.BULK_DELETE_MESSAGES_MIN || messages.length > Constants.BULK_DELETE_MESSAGES_MAX) {
            throw new Error(`Amount of messages to be deleted has to be between ${Constants.BULK_DELETE_MESSAGES_MIN} and ${Constants.BULK_DELETE_MESSAGES_MAX}`);
        }
        // (Current date - (discord epoch + 2 weeks)) * weird constant that everybody seems to use
        let oldestSnowflake = (Date.now() - 1421280000000) * 4194304;
        let forbiddenMessage = messages.find(m => m < oldestSnowflake);
        if (forbiddenMessage) {
            throw new Error(`The message ${forbiddenMessage} is older than 2 weeks and may not be deleted using the bulk delete endpoint`);
        }
        return this.requestHandler.request(Endpoints.CHANNEL_BULK_DELETE(channelId), 'post', 'json', messages);
    }

    /**
     * Add a reaction to a message
     * @param {String} channelId - id of the channel
     * @param {String} messageId - id of the message
     * @param {String} emoji - reaction emoji to add
     * @returns {Promise}
     */
    async createReaction(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, '@me'), 'put', 'json');
    }

    /**
     * Delete a reaction added by the current user from a message
     * @param {String} channelId - id of the channel
     * @param {String} messageId - id of the message
     * @param {String} emoji - reaction emoji
     * @returns {Promise}
     */
    async deleteReactionSelf(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, '@me'), 'delete', 'json');
    }

    /**
     * Delete a reaction from a message
     * @param {String} channelId - id of the channel
     * @param {String} messageId - id of the message
     * @param {String} emoji - reaction emoji
     * @param {String} userId - id of the user
     * @returns {Promise}
     */
    async deleteReaction(channelId, messageId, emoji, userId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, userId), 'delete', 'json');
    }

    /**
     * Get a list of users that reacted with a certain emoji on a certain message
     * @param {String} channelId - id of the channel
     * @param {String} messageId - id of the message
     * @param {String} emoji - reaction emoji
     * @returns {Promise.<Array>} array of [user objects](https://discordapp.com/developers/docs/resources/user#user-object)
     */
    async getReactions(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emoji), 'get', 'json');
    }

    /**
     * Delete all reactions from a message
     * @param {String} channelId - id of the channel
     * @param {String} messageId - id of the message
     * @returns {Promise}
     */
    async deleteAllReactions(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTIONS(channelId, messageId), 'delete', 'json');
    }

    /**
     * Modify the permission overwrites of a channel
     * @param {String} channelId - id of the channel
     * @param {String} permissionId - id of the permission overwrite
     * @param {PermissionOverwrite} data
     * @returns {Promise}
     */
    async editChannelPermissions(channelId, permissionId, data) {
        return this.requestHandler.request(Endpoints.CHANNEL_PERMISSION(channelId, permissionId), 'put', 'json', data);
    }

}

/**
 * @typedef {Object} Channel
 * @property {String} id - id of the channel
 * @property {Number} type - [type](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-types) of channel
 * @property {String} [guild_id] - id of the {Guild} of the channel
 */

/**
 * @typedef {Object} PermissionOverwrite
 * @property {Number} allow - bitwise value of allowed permissions
 * @property {Number} deny - bitwise value of disallowed permissions
 * @property {String} type - type of the overwrite, either member or role
 */

module.exports = ChannelMethods;