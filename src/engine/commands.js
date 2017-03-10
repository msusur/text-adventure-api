const GameResult = require('./gameResult');
const InventoryItem = require('./inventoryItem');

module.exports = {
    DropItem: function(entity, context, game) {
        debugger;
    },
    Move: function(entity, context, game) {
        debugger;
    },
    Open: function(entity, context, game) {
        debugger;
    },
    TakeItem: function(entity, context, game) {
        const location = game.story.map[context.currentLocation];
        let interactionItem;
        Object.keys(location.interactions).forEach(interaction => {
            if (entity.what_to_take && entity.what_to_take.includes(interaction)) {
                interactionItem = interaction;
            }
        });
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
        let interactionItem;
        Object.keys(location.interactions).forEach(interaction => {
            if (entity.item && entity.item.includes(interaction)) {
                interactionItem = interaction;
            }
        });
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
            const text = useOperation(context);
            return new GameResult(text);
        }
        // None of the above means this is a text.
        return new GameResult(useOperation);
    },
    Look: function(entity, context, game) {
        debugger;
    }
};