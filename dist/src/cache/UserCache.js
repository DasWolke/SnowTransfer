"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const DewCache_1 = __importDefault(require("./DewCache"));
class UserCache extends DewCache_1.default {
    constructor(user) {
        super();
        this.user = user;
    }
    fetchUser(userID) {
        if (this.has(userID)) {
            return Promise.resolve(this.get(userID));
        }
        else {
            return this.user.getUser(userID);
        }
    }
}
module.exports = UserCache;
