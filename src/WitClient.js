const { Wit, log, interactive } = require('node-wit');
const accessToken = 'HXOBKUGICZIB5TIJWXZDU52VSK5BO76N';

class WitClient {
    constructor(actions) {
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