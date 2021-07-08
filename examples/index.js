const SnowTransfer = require("../src/SnowTransfer");
const config = require("./config.json");
const client = new SnowTransfer(config.token);
const request = async () => {
	const message = await client.channel.createMessage("your channel id here", {
		embeds: [{
			title: "memes",
			description: "memes"
		}]
	});
	console.log(message);
};
request().then(() => {
	console.log("your memes worked");
}).catch(e => {
	console.error(e);
});
