const WitClient = require('../WitClient');

class Parser {
    constructor(accessToken) {
        this.client = new WitClient(accessToken);
    }

    parseCommand(input) {
        const getConfidentItem = (items) => {
            let currentItem;

            items.forEach((item, index) => {
                if (!currentItem || currentItem.confidence < item.confidence) {
                    currentItem = item;
                }
            });
            return currentItem;
        };

        const getIntent = (entities) => {
            let intent = entities.intent;
            if (intent) {
                return getConfidentItem(intent);
            }
        };

        const getEntities = (entities) => {
            const entityResult = {};
            for (var entity in entities) {
                if (entities.hasOwnProperty(entity)) {
                    if (entity !== 'intent') {
                        let mostConfidentItem = getConfidentItem(entities[entity]);
                        if (!mostConfidentItem) {
                            mostConfidentItem = {
                                value: 'Not Found'
                            };
                        }
                        entityResult[entity] = mostConfidentItem.value;
                    }
                }
            }
            return entityResult;
        };

        return new Promise((resolve, reject) => {
            let gameCommand = this.checkGameCommand(input);
            if (gameCommand) {
                return resolve(gameCommand);
            }
            this.client.sendMessage(input).then((result) => {
                let intent = getIntent(result.entities);
                if (!intent) {
                    intent = {
                        value: "Undefined"
                    };
                }
                let command = {
                    action: intent.value,
                    entities: getEntities(result.entities)
                };
                resolve(command);
            });
        });
    }

    checkGameCommand(input) {
        if (input.toLowerCase() === '\\start') {
            return {
                action: 'StartGame'
            };
        }
        if (input.toLowerCase() === '\\reset') {
            return {
                action: 'ResetGame'
            };
        }
    }
}

module.exports = Parser;