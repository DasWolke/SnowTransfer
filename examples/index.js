let SnowTransfer = require('../dist/src/SnowTransfer');

// also works without `default`
let client = new SnowTransfer.default('token');
let request = async () => {
    let message = await client.channel.createMessage('your channel id here', {
        content: 'hello',
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
