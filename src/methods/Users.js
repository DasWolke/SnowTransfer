const Endpoints = require('../Endpoints');

class UserMethods {
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    async getSelf() {
        return this.requestHandler.request(Endpoints.USER('@me'), 'get', 'json');
    }

    async getUser(userId) {
        return this.requestHandler.request(Endpoints.USER(userId), 'get', 'json');
    }

    async updateSelf(data) {
        return this.requestHandler.request(Endpoints.USER('@me'), 'patch', 'json', data);
    }

    async getGuilds() {
        return this.requestHandler.request(Endpoints.USER_GUILDS('@me'), 'get', 'json');
    }

    async leaveGuild(guildId) {
        return this.requestHandler.request(Endpoints.USER_GUILD('@me', guildId), 'delete', 'json');
    }

    async getDirectMessages() {
        return this.requestHandler.request(Endpoints.USER_CHANNELS('@me'), 'get', 'json');
    }

    async createDirectMessageChannel(userId) {
        return this.requestHandler.request(Endpoints.USER_CHANNELS('@me'), 'post', 'json', {recipient_id: userId});
    }
}

module.exports = UserMethods;