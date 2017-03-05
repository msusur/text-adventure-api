const fetch = require('node-fetch');
const request = require('request');

const VERIFY_TOKEN = 'QSB2ZXJ5IGF3ZXNvbWUgdG9rZW4gZm9yIGEgc3VwZXIgYXdlc29tZSB0ZWFtISE=';
const PAGE_ACCESS_TOKEN = 'EAAHBLu628ZB8BABEfBa14EnGeNv4Jksae8DSNEjsmFJ1sSYlDTP6v2ExwQWpTBsbbgq8qfvRfIs8GWEYsKko9fMnZAhQZBwa2ladUQRWKNPd2BOsiuDFdDApTLZApEB7c6fZBLCjeYir8tvbtwD8dOcpCm0yf6aPfzdZCNHpQaKQZDZD';

class FacebookWebHook {
    constructor() {
        this.sessions = {};
    }

    parseMessage(req, res, wit, confidenceChecker) {
        const data = req.body;
        console.log(`incoming message : ${JSON.stringify(data)}`);
        if (data.object === 'page') {
            data.entry.forEach(entry => {
                entry.messaging.forEach(event => {
                    if (event.message && !event.message.is_echo) {
                        const sender = event.sender.id;
                        const sessionId = this.findOrCreateSession(sender);

                        const { text, attachments } = event.message;

                        if (attachments) {
                            this.fbMessage(sender, 'Sorry I can only process text messages for now.')
                                .catch(console.error);
                        } else if (text) {
                            confidenceChecker(sender, text, sessionId, this.sessions);
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
            this.sessions[sessionId] = { fbid: fbid, context: {} };
        }
        return sessionId;
    }

    fbMessage(id, text) {
        const body = JSON.stringify({
            recipient: { id },
            message: { text },
        });
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
    }
}

module.exports = FacebookWebHook;