const Commands = require('./commands');
const GameResult = require('./gameResult');

const executeCommand = (command, session, gameLevel) => {
    const action = command.action,
        entities = command.entities,
        context = session.context;
    if (!action || action === "Undefined") {
        return new GameResult('Ne dediğini anlamadım.');
    }
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
        const executionResponse = executeCommand(command, session, this.currentLevel);
        if (executionResponse.room) {
            return this.changeRoom(executionResponse, session.context, this.currentLevel);
        }
        return executionResponse;
    }

    changeRoom(command, state, level) {
        const nextRoom = level.story.map[command.room];
        if (nextRoom) {
            state.currentLocation = command.room;

            return new GameResult(command.text + '\r\n' + nextRoom.initial);
        }
        return new GameResult("Yeni odaya gecilemiyor. Bir hata olustu.");
    }
}

module.exports = GameEngine;