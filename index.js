const Snowtransfer = require('./src/SnowTransfer');

/**
 * Create a new SnowTransfer instance
 * @param {Object|Array|any} args - arguments that should be passed to SnowTransfer
 * @return {SnowTransfer}
 * @constructor
 */
function SnowTransfer(...args) {
    return new Snowtransfer(...args);
}
module.exports.SnowTransfer = SnowTransfer;
module.exports = SnowTransfer;