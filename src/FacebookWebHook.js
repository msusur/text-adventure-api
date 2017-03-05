const fetch = require('node-fetch');
const request = require('request');

const VERIFY_TOKEN = 'QSB2ZXJ5IGF3ZXNvbWUgdG9rZW4gZm9yIGEgc3VwZXIgYXdlc29tZSB0ZWFtISE=';
const PAGE_ACCESS_TOKEN = 'EAAHBLu628ZB8BABEfBa14EnGeNv4Jksae8DSNEjsmFJ1sSYlDTP6v2ExwQWpTBsbbgq8qfvRfIs8GWEYsKko9fMnZAhQZBwa2ladUQRWKNPd2BOsiuDFdDApTLZApEB7c6fZBLCjeYir8tvbtwD8dOcpCm0yf6aPfzdZCNHpQaKQZDZD';

const prepareMessageBody = (id, text) => {
    let body = {
        recipient: { id }
    };
    if (text) {
        body.message = { text };
    } else {
        body.sender_action = "typing_on";
    }

    return JSON.stringify(body);
};

const fetchMessage = (body) => {
    const qs = 'access_token=' + encodeURIComponent(PAGE_ACCESS_TOKEN);
    return fetch('https://graph.facebook.com/me/messages?' + qs, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
        })
        .then(rsp => rsp.json())
        .then(json => {
            if (json.error && json.error.message) {
                throw new Error(json.error.message);
            }
            return json;
        });
};

class FacebookWebHook {
    constructor() {
        this.sessions = {};
    }

    parseMessage(req, res, wit, execute) {
        const data = req.body;

        console.log(`incoming message : ${JSON.stringify(data)}`);
        if (data.object === 'page') {
            data.entry.forEach(entry => {
                entry.messaging.forEach(event => {
                    if (event.message && !event.message.is_echo) {
                        const sender = event.sender.id;
                        const sessionId = this.findOrCreateSession(sender);

                        const { text, attachments } = event.message;
                        this.typing(sessionId);

                        if (attachments) {
                            this.fbMessage(sender, 'Sorry I can only process text messages for now.')
                                .catch(console.error);
                        } else if (text) {
                            execute(sender, text, sessionId, this.sessions);
                        }
                    } else {
                        console.log('received event', JSON.stringify(event));
                    }
                });
            });
        }
    }

    setupHooks(req, res) {
        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === VERIFY_TOKEN) {
            res.send(req.query['hub.challenge']);
        } else {
            res.sendStatus(400);
        }
    }

    findOrCreateSession(fbid) {
        let sessionId;
        // Check for session.
        Object.keys(this.sessions).forEach(k => {
            if (this.sessions[k].fbid === fbid) {
                // Yep, got it!
                sessionId = k;
            }
        });
        if (!sessionId) {
            // Create a new session.
            sessionId = new Date().toISOString();
            this.fbMessage(fbid, "Selam, oyuna baslamak icin 'oyuna basla' yazabilirsin.");
            this.sessions[sessionId] = { fbid: fbid, context: {} };
        }
        return sessionId;
    }

    typing(id) {
        const body = prepareMessageBody(id);
        return fetchMessage(body);
    }

    fbMessage(id, text) {
        const body = prepareMessageBody(id, text);
        return fetchMessage(body);
    }
}

module.exports = FacebookWebHook;