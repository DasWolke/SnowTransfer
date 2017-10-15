let SnowTransfer = require('../src/SnowTransfer');
let config = require('./config.json');
let client = new SnowTransfer(config.token);
let request = async () => {
    await client.channel.createMessage('339114875769061409', '<:awooo:322522663304036352>');
    // let messages = await client.channel.getChannelMessages('312298984964227072');
    // console.log(messages);
};
request().then(() => {
    console.log('your memes worked');
}).catch(e => {
    console.error(e);
});