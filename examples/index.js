let SnowTransfer = require('../src/SnowTransfer');
let config = require('./config.json');
let client = new SnowTransfer(config.token);
let request = async () => {
    let message = await client.channel.createMessage('312298984964227072', {
        embed: {
            title: 'memes',
            description: 'memes'
        }
    });
    console.log(message);
};
request().then(() => {
    console.log('your memes worked');
}).catch(e => {
    console.error(e);
});