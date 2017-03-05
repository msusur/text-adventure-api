const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

const WitClient = require('./WitClient');
const FacebookHook = require('./FacebookWebHook');
const Actions = require('./Actions');

app.use(bodyParser.json());

const actions = new Actions();
const wit = new WitClient(actions);
const hook = new FacebookHook();

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
        res.sendStatus(200);
    });
});


app.use(router);

app.listen(process.env.PORT || 8080, () => {
    console.log('working...');
});