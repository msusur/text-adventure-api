const Commands = require('./commands');
const GameResult = require('./gameResult');

const executeCommand = (command, session, gameLevel) => {
    const action = command.action,
        entities = command.entities,
        context = session.context;

    return Commands[action](entities, context, gameLevel);
};

const findOrCreateSession = (sessions, id) => {
    let currentSession;
    Object.keys(sessions).forEach(k => {
        if (sessions[k].guid === id) {
            currentSession = sessions[k];
        }
    });
    if (!currentSession) {
        currentSession = sessions[id] = { guid: id, context: null };
    }
    return currentSession;
};

class GameEngine {
    constructor(sessions, gameLevel) {
        this.sessions = sessions;
        this.currentLevel = gameLevel;
    }

    processCommand({ command, sessionId }) {
        let session = findOrCreateSession(this.sessions, sessionId);
        if (session.context === null) {
            const location = this.currentLevel.story.player.start;
            session.context = {
                inventory: [],
                currentLocation: location
            };
            this.sessions[sessionId] = session;
            let text = this.currentLevel.story.map[location].initial;
            const result = new GameResult(text);
            return result;

        }
        return executeCommand(command, session, this.currentLevel);
    }
}

module.exports = GameEngine;