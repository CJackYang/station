const DeepFreeze = require('deep-freeze')

let FILE = {
    PUBKEY: 'station/data/pubkey.pub',
    PVKEY: 'station/data/pv.pem',
    SA: 'station/data/sa.json'
}

let CONFIG = {
    CLOUD_PATH: 'http://10.10.9.59:5757/'
}

Object.freeze(FILE)
Object.freeze(CONFIG)

module.exports = { FILE, CONFIG }