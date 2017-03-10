const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

const WitClient = require('./WitClient');
const FacebookHook = require('./FacebookWebHook');
const Parser = require('./engine/parser');
const GameEngine = require('./engine/gameEngine');
const BasicLevel = require('./engine/levels/basic');
app.use(bodyParser.json());

const hook = new FacebookHook();
const parser = new Parser();
var sessions = {};
const game = new GameEngine(sessions, BasicLevel);


const wit = new WitClient();

app.use(express.static(__dirname + '/public'));

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
    const id = req.body.id;
    parser.parseCommand(message).then((command) => {
        let result = game.processCommand({
            command,
            sessionId: id
        });
        res.send({ result });
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
        }
    });
});


app.use(router);

app.listen(process.env.PORT || 8080, () => {
    console.log('working...');
});