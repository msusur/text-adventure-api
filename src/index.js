const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

const WitClient = require('./WitClient');
const FacebookHook = require('./FacebookWebHook');
const Parser = require('./engine/parser');
app.use(bodyParser.json());

const hook = new FacebookHook();
const parser = new Parser();

const firstEntity = (entities, entity) => {
    const val = entities && entities[entity] &&
        Array.isArray(entities[entity]) &&
        entities[entity].length > 0 &&
        entities[entity][0];;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val : val;
};
const Actions = {
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
    },
    emotionUpdate({ sessionId, context, entities }) {
        return new Promise(function(resolve, reject) {
            const emotion = firstEntity(entities, 'emotion');
            if (!emotion) {
                context.emotionMissing = true;
                return resolve(context);
            }

            return resolve(context);
        });
    }
};
const wit = new WitClient(Actions);

router.get('/api/alive', (req, res) => {
    res.send({ res: true });
    res.end();
});

router.get('/api/bot/message', (req, res) => {
    hook.setupHooks(req, res);
    res.end();
});

router.post('/api/console/input', (req, res) => {
    const message = req.body.message;
    parser.parseCommand(message).then((command) => {
        res.send({ res: command });
        res.end();
    });
});

router.post('/api/bot/message', (req, res) => {
    hook.parseMessage({
        req: req,
        res: res,
        execute: (sender, text, sessionId, sessions) => {
            console.log(`Asking WIT: \r\n"${text}".`);
            parser.parseCommand(text).then((command) => {
                hook.fbMessage(sender, JSON.stringify(command))
                    .catch(console.error);
                res.sendStatus(200);
            });
            // wit.runActions(
            //     sessionId,
            //     text,
            //     sessions[sessionId].context
            // ).then((context) => {
            //     context.sessionId = sessionId;
            //     context.senderId = sender;
            //     console.log('Waiting for next user messages');
            //     sessions[sessionId].context = context;
            // }).catch((err) => {
            //     console.error('Oops! Got an error from Wit: ', err.stack || err);
            // });
        }
    });
});


app.use(router);

app.listen(process.env.PORT || 8080, () => {
    console.log('working...');
});