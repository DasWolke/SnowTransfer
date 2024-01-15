# A minimalistic rest client for the discord api

---
[![GitHub stars](https://img.shields.io/github/stars/DasWolke/SnowTransfer.svg)](https://github.com/DasWolke/SnowTransfer/stargazers) [![npm](https://img.shields.io/npm/dm/snowtransfer.svg)](https://www.npmjs.com/package/snowtransfer) [![npm](https://img.shields.io/npm/v/snowtransfer.svg)](https://www.npmjs.com/package/snowtransfer)

Part of the WeatherStack

SnowTransfer is a small library specially made to **only** cover the REST/HTTP area of the discord api.
It makes no assumptions about the rest of your stack, therefore you can use it anywhere as long as you use node 14 or higher.

### Some of the things that make SnowTransfer awesome:
- No requirement for other components
- Full coverage of the discord rest api
- Well documented
- Supports both Bot and Bearer tokens (Bearer tokens will have much more limited access than Bot tokens)

### General Usecase:
SnowTransfer is not your everyday library,
especially compared to other libraries, it makes sense to use it when you:
- Want to build a microservice based bot, where casual discord libraries would not be suitable since they assume the availability of other components like a gateway or a cache
- Only need a simple rest client that can be wrapped easily.

### Microservice Bots:
I've written a general whitepaper on the idea of microservice bots, which you can find on gist: [Microservice Bot Whitepaper](https://gist.github.com/DasWolke/c9d7dfe6a78445011162a12abd32091d)

### Documentation:
You can find the docs at [https://daswolke.github.io/SnowTransfer/](https://daswolke.github.io/SnowTransfer/)

### Installation:
To install SnowTransfer, make sure that you have node 14 or higher and npm installed on your computer.

Then run the following command in a terminal `npm install snowtransfer`

## Example:
```js
const { SnowTransfer } = require('snowtransfer');
const client = new SnowTransfer('DISCORD BOT TOKEN');
const request = async () => {
	const message = await client.channel.createMessage('channel id', 'hi there');
	console.log(message);
};
request().then(() => {
	// message was sent to discord
}).catch(e => {
	// an error occurred
});
```
