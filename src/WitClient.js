const { Wit, log, interactive } = require('node-wit');
const accessToken = 'M5IEIAQFV4KPEYMI7DU33KAZRY5HKWTU';

class WitClient {
    constructor(actions) {
        this.client = new Wit({ accessToken, actions });
    }

    sendMessage(message) {
        return this.client.message(message, {});
    }

    runActions(sessionId, message, context) {
        return this.client.runActions(sessionId, message, context);
    }
}

module.exports = WitClient;