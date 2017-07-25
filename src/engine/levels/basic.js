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
    codes: {
        "laptopCode": `
            Code var burada.
        `
    },
    story: {
        intro: "Hos geldin!",
        player: {
            start: "TheRoom"
        },
        map: {
            "TheRoom": {
                initial: "Gozlerini actiginda tavandaki catlaklari gordun. Catlaklar sana tanidik gelmedi, kendi evinde uyanmadigini fark ettin ve ayaga kalktin. Etrafinda ayaga kalktigin pis yatak, bir masa ve bir de kapi var. Ne yapiyorsun?",
                interactions: {
                    "yatak": {
                        look: "Yatak üzerinde çarşaf bile yok ve çok pis."
                    },
                    "masa": {
                        look: function(state) {
                            let key = findItemInInventory(state.inventory, "anahtar");
                            if (key) {
                                return "Masa boş duruyor.";
                            }
                            return "Masanın üzerinde bir anahtar var.";
                        }
                    },
                    "kapı": {
                        use: function(state) {
                            let item = findItemInInventory(state.inventory, "anahtar");
                            if (item) {
                                return {
                                    text: "Kapı açıldı ve yeni bir odaya girdin.",
                                    room: "TheLab"
                                };
                            }
                            return "Kapı kilitli.";
                        },
                        look: "Eski püskü bir kapı. Ama epey sağlam duruyor. Üzerinde bazı lekeler var."
                    },
                    "anahtar": {
                        take: "Anahtarı aldin.",
                        look: "Eski ve yıpranmış bir anahtar",
                        use: "Kapı açıldı.",
                        drop: "Yere biraktin."
                    }
                }
            },
            "TheLab": {
                initial: "Labaratuvara girdiğinde ışıkların yanıp söndüğünü görüyorsun. Her yerde kırılmış deney tüpleri var. " +
                    "Solunda bir masa ve sağ tarafında eski bir bilgisayar var ve odanın ilerisinde bir kapı var.",
                interactions: {
                    "kapı": {
                        look: "Kapı kapalı duruyor. Sanki sadece elektronik bir sekilde acilacak gibi.",
                        use: "Nasıl kullanacağını bilmiyorsun. Uzerinde hic bir sey yok."
                    },
                    "masa": {
                        look: "Masanın üzerinde bir sürü deney tüpü ve yeşil bir sıvı var. Çok tekin görünmüyor"
                    },
                    "tüp": {
                        look: "Çatlak ama kullanılabilir duruyor",
                        take: "Deney tüpünü aldın"
                    },
                    "bilgisayar": {
                        look: "Eski bir bilgisayar, ekranı çatlamış ama hala çalışıyor.",
                        use: "Yazilimci Notu: Burada bir kod penceresi açılacak. Daha üzerinde çalışıyorum..."
                    }
                }
            }
        }
    }
};