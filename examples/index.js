"use strict";

const { SnowTransfer } = require("../");

const config = require("./config.json");
const client = new SnowTransfer(config.token);

client.channel.createMessage("your channel id here", {
	embeds: [{
		title: "memes",
		description: "memes"
	}]
}).then(console.log).catch(console.error);
