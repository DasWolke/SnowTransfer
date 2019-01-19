const Endpoints = require('../Endpoints');
const Constants = require('../Constants');

/**
 * Methods for interacting with Channels and Messages
 */
class ChannelMethods {
    /**
     * Create a new Channel Method handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.channel.method`, where `client` is an initialized SnowTransfer instance
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     * @param {Boolean} disableEveryone - Disable @everyone/@here on outgoing messages
     * @constructor
     */
    constructor(requestHandler, disableEveryone) {
        this.requestHandler = requestHandler;
        this.disableEveryone = disableEveryone;
    }

    /**
     * Get a channel via Id
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Channel>} - [discord channel](https://discordapp.com/developers/docs/resources/channel#channel-object) object
     * @example
     * let client = new SnowTransfer('TOKEN')
     * let channel = await client.channel.getChannel('channel id')
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
     * @returns {Promise.<Channel>} [discord channel](https://discordapp.com/developers/docs/resources/channel#channel-object) object
     *
     * | Permissions needed | Condition |
     |--------------------|----------:|
     | MANAGE_CHANNELS    |    always |
     * @example
     * // This example updates a channel with the passed id to use "New Name" as it's name and "Look at this cool topic" as the topic
     * let client = new SnowTransfer('TOKEN')
     * let updateData = {
     *   name: 'New Name',
     *   topic: 'Look at this cool topic'
     * }
     * client.channel.updateChannel('channel id', updateData)
     */
    async updateChannel(channelId, data) {
        return this.requestHandler.request(Endpoints.CHANNEL(channelId), 'patch', 'json', data);
    }

    /**
     * Delete a channel via Id
     *
     * This either **deletes** a Guild Channel or **closes** a Direct Message Channel
     *
     * **Be careful with deleting Guild Channels as this can not be undone!**
     *
     * When deleting a category, this does **not** delete the child channels of a category. They will just have their `parent_id` removed.
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Channel>} [discord channel](https://discordapp.com/developers/docs/resources/channel#channel-object) object
     *
     * | Permissions needed |                        Condition |
     |--------------------|---------------------------------:|
     | MANAGE_CHANNELS    |    When deleting a Guild Channel |
     */
    async deleteChannel(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL(channelId), 'delete', 'json');
    }

    /**
     * Get a list of messages from a channel
     * @param {String} channelId - Id of the channel
     * @param {Object} [options]
     * @param {String} [options.around] - Get's messages around the Id of the passed snowflake
     * @param {String} [options.before] - Get's messages before the Id of the passed snowflake
     * @param {String} [options.after] - Get's messages after the Id of the passed snowflake
     * @param {Number} [options.limit=50] - Number of messages to get, values between 1-100 allowed
     * @returns {Promise.<Object[]>} Array of [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) objects
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | READ_MESSAGES      |    always |

     * @example
     * // Fetch the last 20 messages from a channel
     * let client = new SnowTransfer('TOKEN')
     * let options = {
     *   limit: 20
     * }
     * let messages = await client.channel.getChannelMessages('channel id', options);
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
     * Get a single message via Id
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @returns {Promise.<Object>} [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) object
     *
     * | Permissions needed   | condition |
     |----------------------|----------:|
     | READ_MESSAGE_HISTORY |    always |

     * @example
     * // Get a single message from a channel via id
     * let client = new SnowTransfer('TOKEN')
     * let message = await client.channel.getChannelMessage('channel id', 'message id')
     */
    async getChannelMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), 'get', 'json');
    }


    /**
     * Creates a new Message within a channel
     *
     * **Make sure to use a filename with a proper extension (e.g. png, jpeg, etc.) when you want to upload files**
     * @param {String} channelId - Id of the Channel to sent a message to
     * @param {Object|String} data - Data to send, if data is a string it will be used as the content of the message,
     * if data is not a string you should take a look at the properties below to know what you may send
     * @param {?String} [data.content] - Content of the message
     * @param {?Boolean} [data.tts=false] - if this message is text-to-speech
     * @param {Object} [data.embed] - [Embed](https://discordapp.com/developers/docs/resources/channel#embed-object) to send
     * @param {Object} [data.file] - File, that should be uploaded
     * @param {String} [data.file.name] - Name of the file
     * @param {File} [data.file.file] - Buffer with file contents
     * @param {?Boolean} [options.disableEveryone] - Disable @everyone/@here on the message
     * @returns {Promise.<Object>} [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) object
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | SEND_MESSAGES      |    always |
     *
     * @example
     * // Make a bot say "hi" within a channel
     * // createMessage sends the passed data as content, when you give it a string
     * let client = new SnowTransfer('TOKEN')
     * client.channel.createMessage('channel id', 'hi')
     *
     * @example
     * // Send a rich embed object
     * let client = new SnowTransfer('TOKEN')
     * let embedData = {
     *   title: 'This is a nice embed',
     *   description: 'But winter is so cold',
     *   fields: [
     *       {name: 'Brr', value: 'Insert snowflake emoji here'}
     *     ]
     * }
     * client.channel.createMessage('channel id', {embed: embedData})
     *
     * @example
     * // Send a file with a comment
     * let client = new SnowTransfer('TOKEN')
     * // fileData will be a buffer with the data of the png image.
     * let fileData = fs.readFileSync('nice_picture.png') // You should probably use fs.readFile, since it's asynchronous, synchronous methods may lag your bot.
     * client.channel.createMessage('channel id', {content: 'This is a nice picture', file: {name: 'Optional Filename.png', file: fileData}})
     */
    async createMessage(channelId, data, options = {}) {
        if (typeof data !== 'string' && !data.content && !data.embed && !data.file) {
            throw new Error('Missing content or embed');
        }
        if (typeof data === 'string') {
            data = {content: data};
        }

        // Sanitize the message
        if (data.content && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
            data.content = data.content.replace(/@everyone/g, "@\u200beveryone").replace(/@here/g, "@\u200bhere");
        }

        if (data.file) {
            return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), 'post', 'multipart', data);
        } else {
            return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), 'post', 'json', data);
        }
    }

    /**
     * Edit a message sent by the current user
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @param {Object|String} data - Data to send
     * @param {String} [data.content] - Content of the message
     * @param {Object} [data.embed] - Embed to send
     * @param {?Boolean} [options.disableEveryone] - Disable @everyone/@here on the message
     * @returns {Promise.<Object>} [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) object
     * @example
     * // Simple ping response
     * let client = new SnowTransfer('TOKEN')
     * let time = Date.now()
     * let message = await client.channel.createMessage('channel id', 'pong')
     * client.channel.editMessage('channel id', message.id, `pong ${Date.now() - time}ms`)
     */
    async editMessage(channelId, messageId, data, options = {}) {
        if (typeof data !== 'string' && !data.content && !data.embed) {
            throw new Error('Missing content or embed');
        }
        if (typeof data === 'string') {
            data = {content: data};
        }

        // Sanitize the message
        if (data.content && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
            data.content = data.content.replace(/@everyone/g, "@\u200beveryone").replace(/@here/g, "@\u200bhere");
        }

        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), 'patch', 'json', data);
    }

    /**
     * Delete a message
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed |                                 condition|
     |--------------------|---------------------------------------------:|
     | MANAGE_MESSAGES    | When the bot isn't the author of the message |
     * @example
     * // Delete a message
     * let client = new SnowTransfer('TOKEN')
     * client.channel.deleteMessage('channel id', 'message id')
     */
    async deleteMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), 'delete', 'json');
    }

    /**
     * Bulk delete messages, messages may not be older than 2 weeks
     * @param {String} channelId - Id of the channel
     * @param {String[]} messages - array of message ids to delete
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_MESSAGES    |    always |
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
        return this.requestHandler.request(Endpoints.CHANNEL_BULK_DELETE(channelId), 'post', 'json', {messages});
    }

    /**
     * Adds a reaction to a message
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @param {String} emoji - uri encoded reaction emoji to add,
     * you may either use a discord emoji in the format `:emoji_name:emoji_id` or a unicode emoji,
     * which can be found [here](http://www.unicode.org/emoji/charts/full-emoji-list.html)
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed   | Condition                                           |
     |----------------------|----------------------------------------------------:|
     | READ_MESSAGE_HISTORY | always                                             |
     | ADD_REACTIONS        | When no other user has reacted with the emoji used |
     * @example
     * // This example uses a discord emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.createReaction('channel Id', 'message Id', encodeURIComponent(':awooo:322522663304036352'));
     * @example
     * // using a utf-8 emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.createReaction('channel Id', 'message Id', encodeURIComponent('😀'));
     */
    async createReaction(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, '@me'), 'put', 'json');
    }

    /**
     * Delete a reaction added by the current user from a message
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @param {String} emoji - reaction emoji
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     * @example
     * // This example uses a discord emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.deleteReactionSelf('channel Id', 'message Id', encodeURIComponent(':awooo:322522663304036352'));
     * @example
     * // using a utf-8 emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.deleteReactionSelf('channel Id', 'message Id', encodeURIComponent('😀'));
     */
    async deleteReactionSelf(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, '@me'), 'delete', 'json');
    }

    /**
     * Delete a reaction from a message
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @param {String} emoji - reaction emoji
     * @param {String} userId - Id of the user
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permission        | Condition    |
     |-----------------    |-------:   |
     | MANAGE_MESSAGES    | always    |
     * @example
     * // This example uses a discord emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.deleteReaction('channel Id', 'message Id', encodeURIComponent(':awooo:322522663304036352'), 'user Id');
     * @example
     * // using a utf-8 emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.deleteReaction('channel Id', 'message Id', encodeURIComponent('😀'), 'user Id');
     */
    async deleteReaction(channelId, messageId, emoji, userId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, userId), 'delete', 'json');
    }

    /**
     * Get a list of users that reacted with a certain emoji on a certain message
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @param {String} emoji - reaction emoji
     * @returns {Promise.<User[]>} Array of [user objects](https://discordapp.com/developers/docs/resources/user#user-object)
     * @example
     * // This example uses a discord emoji
     * let client = new SnowTransfer('TOKEN');
     * let reactions = await client.channel.getReactions('channel Id', 'message Id', encodeURIComponent(':awooo:322522663304036352'));
     */
    async getReactions(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emoji), 'get', 'json');
    }

    /**
     * Delete all reactions from a message
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_MESSAGES    |    always |
     */
    async deleteAllReactions(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTIONS(channelId, messageId), 'delete', 'json');
    }

    /**
     * Modify the permission overwrites of a channel
     * @param {String} channelId - Id of the channel
     * @param {String} permissionId - Id of the permission overwrite
     * @param {PermissionOverwrite} data - modified [permission overwrite](https://discordapp.com/developers/docs/resources/channel#edit-channel-permissions-json-params) object
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_ROLES       |    always |
     */
    async editChannelPermission(channelId, permissionId, data) {
        return this.requestHandler.request(Endpoints.CHANNEL_PERMISSION(channelId, permissionId), 'put', 'json', data);
    }

    /**
     * Delete a permission overwrite from a channel
     * @param {String} channelId - Id of the channel
     * @param {String} permissionId - Id of the permission overwrite
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_ROLES       |    always |
     */
    async deleteChannelPermission(channelId, permissionId) {
        return this.requestHandler.request(Endpoints.CHANNEL_PERMISSION(channelId, permissionId), 'delete', 'json');
    }

    /**
     * Get a list of invites for a channel
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Invite[]>} Array of [invite objects](https://discordapp.com/developers/docs/resources/invite#invite-object) (with metadata)
     *
     *| Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_CHANNELS    |    always |
     */
    async getChannelInvites(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL_INVITES(channelId), 'get', 'json');
    }

    /**
     * Create an invite for a channel
     *
     * If no data argument is passed, the invite will be created with the defaults listed below
     * @param {String} channelId - Id of the channel
     * @param {Object} [data={}] - invite data (optional)
     * @param {Number} [data.max_age=86400] - max age of the invite in seconds
     * @param {Number} [data.max_uses=0] - max uses of the invite
     * @param {Boolean} [data.temporary=false] - if this invite only allows temporary membership
     * @param {Boolean} [data.unique=false] - does not try to re-use similar invites when true (useful for creating many one-time invites)
     * @returns {Promise.<Invite>} [Invite object](https://discordapp.com/developers/docs/resources/invite#invite-object) (with metadata)
     *
     * | Permissions needed    | condition |
     |-----------------------|----------:|
     | CREATE_INSTANT_INVITE |    always |
     */
    async createChannelInvite(channelId, data = {}) {
        return this.requestHandler.request(Endpoints.CHANNEL_INVITES(channelId), 'post', 'json', data);
    }

    /**
     * Send an indicator that the current user is typing within a channel.
     *
     * **You should generally avoid this method unless used for longer computations (>1s)**
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     */
    async startChannelTyping(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL_TYPING(channelId), 'post', 'json');
    }

    /**
     * Get a list of pinned messages for a channel
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Object[]>} Array of [message objects](https://discordapp.com/developers/docs/resources/channel#message-object)
     */
    async getChannelPinnedMessages(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL_PINS(channelId), 'get', 'json');
    }

    /**
     * Pin a message within a channel
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_MESSAGES    |    always |
     */
    async addChannelPinnedMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_PIN(channelId, messageId), 'put', 'json');
    }

    /**
     * Remove a pinned message from a channel
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_MESSAGES    |    always |
     */
    async removeChannelPinnedMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints.CHANNEL_PIN(channelId, messageId), 'delete', 'json');
    }

    /**
     * Add a user to a group dm
     * @param {String} channelId - Id of the channel
     * @param {String} userId - Id of the user to be removed
     * @param {Object} data - Data to send to this endpoint
     * @param {String} data.access_token - access token of the user that granted the app the gdm.join scope
     * @param {String} [data.nick] - nickname of the user being added
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | OAUTH2 Scopes |
     |---------------|
     | gdm.join      |
     */
    async addDmChannelRecipient(channelId, userId, data) {
        return this.requestHandler.request(Endpoints.CHANNEL_RECIPIENT(channelId, userId), 'put', 'json', data);
    }

    /**
     * Remove a recipient from a group dm
     * @param {String} channelId - Id of the channel
     * @param {String} userId - Id of the user to be removed
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     */
    async removeDmChannelRecipient(channelId, userId) {
        return this.requestHandler.request(Endpoints.CHANNEL_RECIPIENT(channelId, userId), 'delete', 'json');
    }

}

// To anyone wanting to write a library: JUST COPY THIS SHIT, filling this out manually wasn't fun :<
// https://www.youtube.com/watch?v=LIlZCmETvsY have a weird video to distract yourself from the problems that will come upon ya
/**
 * @typedef {Object} Channel
 * @property {String} Id - Id of the channel
 * @property {Number} type - [type](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-types) of channel
 * @property {String} [guild_id] - Id of the {Guild} of the channel
 * @property {Number} [position] - sorting position of the channel
 * @property {PermissionOverwrite[]} [permission_overwrites] - array of permission overwrites for this channel
 * @property {String} [name] - name of the channel
 * @property {String} [topic] - topic of the channel
 * @property {Boolean} [nsfw] - if the channel is nsfw (guild only)
 * @property {String} [last_message_id] - the Id of the last message sent in this channel
 * @property {Number} [bitrate] - bitrate of the channel (voice only)
 * @property {Number} [user_limit] - limit of users in a channel (voice only)
 * @property {User[]} [recipients] - recipients of a dm (dm only)
 * @property {String} [icon] - icon hash (dm only)
 * @property {String} [owner_id] - Id of the DM creator (dm only)
 * @property {String} [application_id] - application Id of the creator of the group dm if a bot created it (group dm only)
 * @property {String} [parent_id] - Id of the parent category for a channel
 */

/**
 * @typedef {Object} PermissionOverwrite
 * @property {Number} allow - bitwise value of allowed permissions
 * @property {Number} deny - bitwise value of disallowed permissions
 * @property {String} type - type of the overwrite, either member or role
 */

module.exports = ChannelMethods;
