# SnowTransfer #
## A minimalistic rest client for the discord api
---
SnowTransfer is a small library specially made to **only** cover the REST/HTTP area of the discord api.
It makes no assumptions about the rest of your stack, therefore you can use it anywhere as long as you use node 8 or higher.

#### Some of the things that make SnowTransfer awesome:
- No requirement for other components
- Full coverage of the discord rest api
- Ridiculously documented

### Example: 
```js
let SnowTransfer = require('snowtranfer');
let client = new SnowTransfer('DISCORD BOT TOKEN');
let request = async () => {
    let message = await client.channel.createMessage('channel id', 'hi there');
    console.log(message);
};
request().then(() => {
    // message was sent to discord
}).catch(e => {
    // an error occurred
});
```