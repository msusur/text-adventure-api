const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const requestify = require('requestify');

const WitClient = require('./WitClient');
const FacebookHook = require('./FacebookWebHook');


app.use(bodyParser.json());

const actions = {
    send({ sessionId }, { text }) {
        const recipientId = hook.sessions[sessionId].fbid;
        if (recipientId) {
            return hook.fbMessage(recipientId, text)
                .then(() => null)
                .catch((err) => {
                    console.error(
                        'Oops! An error occurred while forwarding the response to',
                        recipientId,
                        ':',
                        err.stack || err
                    );
                });
        } else {
            console.error('Oops! Couldn\'t find user for session:', sessionId);
            return Promise.resolve();
        }
    }
};

let wit = new WitClient(actions);

router.get('/api/alive', (req, res) => {
    res.send({ res: true });
    res.end();
});

router.get('/api/bot/message', (req, res) => {
    hook.setupHooks(req, res);
    res.end();
});

router.post('/api/bot/message', (req, res) => {
    hook.parseMessage(req, res, wit, (sender, text, sessionId, sessions) => {
            console.log(`Asking WIT`);
            wit.runActions(
                sessionId,
                text,
                sessions[sessionId].context
            ).then((context) => {
                context.sessionId = sessionId;
                context.senderId = sender;
                console.log('Waiting for next user messages');
                sessions[sessionId].context = context;
            }).catch((err) => {
                console.error('Oops! Got an error from Wit: ', err.stack || err);
            });
        }
        res.sendStatus(200);
    });
});