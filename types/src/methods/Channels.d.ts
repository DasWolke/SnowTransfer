import RequestHandler from "../RequestHandler";
import { TPermissionOverwrite, TChannel, TMessage, TUser, TInvite, PartialInputMessage, TEmbed } from "../LibTypes";
/**
 * Methods for interacting with Channels and Messages
 */
declare class ChannelMethods {
    private requestHandler;
    /**
     * Create a new Channel Method handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.channel.method`, where `client` is an initialized SnowTransfer instance
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     * @constructor
     */
    constructor(requestHandler: RequestHandler);
    /**
     * Get a channel via Id
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Channel>} - [discord channel](https://discordapp.com/developers/docs/resources/channel#channel-object) object
     * @example
     * let client = new SnowTransfer('TOKEN')
     * let channel = await client.channel.getChannel('channel id')
     */
    getChannel(channelId: string): Promise<TChannel>;
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
    updateChannel(channelId: string, data: {
        name?: string;
        position?: number;
        topic?: string;
        nsfw?: boolean;
        bitrate?: number;
        user_limit?: number;
        permission_overwrites?: TPermissionOverwrite[];
        parent_id?: string;
    }): Promise<TChannel>;
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
    deleteChannel(channelId: string): Promise<TChannel>;
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
    getChannelMessages(channelId: string, options?: {
        around?: string;
        before?: string;
        after?: string;
        limit?: number;
    }): Promise<TMessage[]>;
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
    getChannelMessage(channelId: string, messageId: string): Promise<TMessage>;
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
    createMessage(channelId: string, data: PartialInputMessage | string): Promise<TMessage>;
    /**
     * Edit a message sent by the current user
     * @param {String} channelId - Id of the channel
     * @param {String} messageId - Id of the message
     * @param {Object|String} data - Data to send
     * @param {String} [data.content] - Content of the message
     * @param {Object} [data.embed] - Embed to send
     * @returns {Promise.<Object>} [discord message](https://discordapp.com/developers/docs/resources/channel#message-object) object
     * @example
     * // Simple ping response
     * let client = new SnowTransfer('TOKEN')
     * let time = Date.now()
     * let message = await client.channel.createMessage('channel id', 'pong')
     * client.channel.editMessage('channel id', message.id, `pong ${Date.now() - time}ms`)
     */
    editMessage(channelId: string, messageId: string, data: {
        content?: string;
        embed?: TEmbed;
    } | string): Promise<TMessage>;
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
    deleteMessage(channelId: string, messageId: string): Promise<void>;
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
    bulkDeleteMessages(channelId: string, messages: Array<string>): Promise<void>;
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
    createReaction(channelId: string, messageId: string, emoji: string): Promise<void>;
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
    deleteReactionSelf(channelId: string, messageId: string, emoji: string): Promise<void>;
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
    deleteReaction(channelId: string, messageId: string, emoji: string, userId: string): Promise<void>;
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
    getReactions(channelId: string, messageId: string, emoji: string): Promise<TUser[]>;
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
    deleteAllReactions(channelId: string, messageId: string): Promise<void>;
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
    editChannelPermission(channelId: string, permissionId: string, data: TPermissionOverwrite): Promise<void>;
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
    deleteChannelPermission(channelId: string, permissionId: string): Promise<void>;
    /**
     * Get a list of invites for a channel
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Invite[]>} Array of [invite objects](https://discordapp.com/developers/docs/resources/invite#invite-object) (with metadata)
     *
     *| Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_CHANNELS    |    always |
     */
    getChannelInvites(channelId: string): Promise<TInvite[]>;
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
    createChannelInvite(channelId: string, data?: {
        max_age?: number;
        max_uses?: number;
        temporary?: boolean;
        unique?: boolean;
    }): Promise<TInvite>;
    /**
     * Send an indicator that the current user is typing within a channel.
     *
     * **You should generally avoid this method unless used for longer computations (>1s)**
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     */
    startChannelTyping(channelId: string): Promise<void>;
    /**
     * Get a list of pinned messages for a channel
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Object[]>} Array of [message objects](https://discordapp.com/developers/docs/resources/channel#message-object)
     */
    getChannelPinnedMessages(channelId: string): Promise<TMessage[]>;
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
    addChannelPinnedMessage(channelId: string, messageId: string): Promise<void>;
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
    removeChannelPinnedMessage(channelId: string, messageId: string): Promise<void>;
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
    addDmChannelRecipient(channelId: string, userId: string, data: {
        access_token: string;
        nick?: string;
    }): Promise<void>;
    /**
     * Remove a recipient from a group dm
     * @param {String} channelId - Id of the channel
     * @param {String} userId - Id of the user to be removed
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     */
    removeDmChannelRecipient(channelId: string, userId: string): Promise<void>;
}
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
 * @property {Number} [user_limit] - limit of users in a channel (1 only)
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
export default ChannelMethods;
//# sourceMappingURL=Channels.d.ts.map