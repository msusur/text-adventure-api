module.exports = {
    findItemInInventory: (inventory, item) => {
        for (let index = 0; index < inventory.length; index += 1) {
            if (inventory[index].name === item) {
                return inventory[index];
            }
        }
        return;
    }
};