const { Wit, log, interactive } = require('node-wit');

class WitClient {
    constructor(accessToken) {
        this.client = new Wit({ accessToken });
    }

    sendMessage(message) {
        return this.client.message(message, {});
    }

    runActions(sessionId, message, context) {
        return this.client.runActions(sessionId, message, context);
    }
}

module.exports = WitClient;