const findItemInInventory = (inventory, item) => {
    for (let index = 0; index < inventory.length; index += 1) {
        if (inventory[index].name === item) {
            return inventory[index];
        }
    }
    return;
};

module.exports = {
    state: {
        currentLocation: "TheRoom",
        inventory: []
    },
    story: {
        intro: "Hosgeldin!",
        player: {
            start: "TheRoom"
        },
        map: {
            "TheRoom": {
                initial: "Gozlerini actiginda tavandaki catlaklari gordun. Catlaklar sana tanidik gelmedi, kendi evinde uyanmadigini fark ettin ve ayaga kalktin. Etrafinda ayaga kalktigin pis yatak, bir masa ve bir de kapi var. Ne yapiyorsun?",
                interactions: {
                    "masa": {
                        look: "Masanin uzerinde bir anahtar var.",
                    },
                    "kapı": {
                        use: function(state) {
                            let item = findItemInInventory(state.inventory, "anahtar");
                            if (item) {
                                return "Kapı açıldı.";
                            }
                            return "Kapı kilitli.";
                        },
                    },
                    "anahtar": {
                        take: "Anahtarı aldin.",
                        use: "Kapı açıldı.",
                        drop: "Yere biraktin."
                    }
                }
            }
        }
    }
};