const Snowtransfer = require('./src/SnowTransfer');
function SnowTransfer(...args) {
    return new Snowtransfer(...args);
}
module.exports.SnowTransfer = SnowTransfer;
module.exports = SnowTransfer;