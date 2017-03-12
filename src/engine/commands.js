const GameResult = require('./gameResult');
const LeaveRoomResult = require('./leaveRoomResult');
const InventoryItem = require('./inventoryItem');

const getMatchingInteraction = (entityValue, game, context) => {
    const location = game.story.map[context.currentLocation];
    let interactionItem;
    Object.keys(location.interactions).forEach(interaction => {
        if (entityValue && entityValue.toLowerCase().includes(interaction)) {
            interactionItem = interaction;
        }
    });
    return interactionItem;
};

module.exports = {
    DropItem: function(entity, context, game) {
        return new GameResult('Not implemented yet.');
    },
    Move: function(entity, context, game) {
        return new GameResult('Not implemented yet.');
    },
    Open: function(entity, context, game) {
        // maybe we don't need this?
        return new GameResult('Not implemented yet.');
    },
    TakeItem: function(entity, context, game) {
        const location = game.story.map[context.currentLocation];
        let interactionItem = getMatchingInteraction(entity.what_to_take, game, context);
        // If there is no interaction item.
        if (!interactionItem) {
            return new GameResult(`Etrafta oyle bir sey yok!`);
        }
        const currentInteraction = location.interactions[interactionItem];
        const takeOperation = currentInteraction.take;
        // if interaction doesn't have the "use" action.
        if (!takeOperation) {
            return new GameResult(`"${interactionItem}" ile öyle bir sey yapilamiyor.`);
        }
        // if interaction is a function.
        if (typeof takeOperation === "function") {
            const text = takeOperation(context);
            return new GameResult(text);
        }
        // Take the item first
        context.inventory.push(new InventoryItem(interactionItem));

        // None of the above means this is a text.
        return new GameResult(takeOperation);
    },
    Use: function(entity, context, game) {
        const location = game.story.map[context.currentLocation];
        let interactionItem = getMatchingInteraction(entity.item, game, context);

        // If there is no interaction item.
        if (!interactionItem) {
            return new GameResult(`Etrafta kullanilacak oyle bir sey yok!`);
        }
        const currentInteraction = location.interactions[interactionItem];
        const useOperation = currentInteraction.use;
        // if interaction doesn't have the "use" action.
        if (!useOperation) {
            return new GameResult(`"${interactionItem}" ile öyle bir sey yapilamiyor.`);
        }
        // if interaction is a function.
        if (typeof useOperation === "function") {
            const operationResult = useOperation(context);
            if (operationResult.room) {
                return new LeaveRoomResult(operationResult.room, operationResult.text);
            }
            return new GameResult(operationResult);
        }
        // None of the above means this is a text.
        return new GameResult(useOperation);
    },
    Look: function(entity, context, game) {
        const location = game.story.map[context.currentLocation];
        let interactionItem = getMatchingInteraction(entity.direction, game, context);
        if (!interactionItem) {
            return new GameResult('Bakabileceğin bir şey yok.');
        }

        const currentInteraction = location.interactions[interactionItem];
        const lookOperation = currentInteraction.look;
        // if interaction doesn't have the "use" action.
        if (!lookOperation) {
            return new GameResult(`"${interactionItem}" hakkında başka bir bilgi yok.`);
        }

        // if interaction is a function.
        if (typeof lookOperation === "function") {
            const text = lookOperation(context);
            return new GameResult(text);
        }

        // None of the above means this is a text.
        return new GameResult(lookOperation);
    }
};