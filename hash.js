const hash = require('hash.js')

module.exports.getHash = obj => hash.sha256().update(obj).digest('hex')