# Text Adventure API Project

## Overview

An old skool text adventure game powered by a high tech language processing AI.

## Configuration

Use the `/config/chat.yml` file to configure your own [WIT AI](https://wit.ai) repo using any of the supported languages or configure facebook secrets if you fancy building a Facebook chatbot using Facebook Messenger platform.

```yaml
default:
  facebook:
  # facebook chatbot attributes
    verify_token: QSB2ZXJ5IGF3ZXNvbWUgdG9rZW4gZm9yIGEgc3VwZXIgYXdlc29tZSB0ZWFtISE=
    page_access_token: EAAHBLu628ZB8BABEfBa14EnGeNv4Jksae8DSNEjsmFJ1sSYlDTP6v2E
  # your wit AI access token. 
  wit:
    access_token: HXOBKUGICZIB5TIJWXZDU52VSK5BO76N
```

## Building

`npm install` to install the Node dependencies and `npm start` to kickstart the application on port `8080`.

## Game Engine and Levels

Game engine recieves the requests then sends them to WIT API to analyse the intent of the incoming text input. Then loads up the game state to determine the current location, inventory and state of the player. If the player's message can converted into an intent that is defined in the game level then calls the game action and updates the state.

All the game specific logic is defined in the `/src/engine/levels/basic.js`. Let's take a quick look at this file.

```js
const helpers = require('./helper.js'); // Helper functions.

{
    // Holds the player's state. This information may change during the game.
    state: {
        currentLocation: "TheRoom", // Determines the player's current location.
        inventory: [] // Player's inventory. You can put some stuff here if you think it makes sense.
    },
    // This is the storyline for the game. This should never change but stored as part of the game state
    story: {
        intro: "Welcome to the game!" // Welcome message or any introduction you want to show your players when the game begins.
        player: {
            start: "TheRoom" // This determines the player's initial location when the game starts.
        },
        // List of rooms in that can be used by the player.
        map: {
            TheRoom: { // Identifier for the room. Can be anything.
                initial: "First thing you saw is the cracks in the ceiling. ....." // Narrator to be displayed to player when they enter to the room.

                // List of interactive items in the room.
                interactions: {
                    // Each player command should include one verb and one noun. 
                    "bed": {
                        look: "A dirty bed."
                    },
                    "key": {
                        take: "You took the key",
                        look: "An old copper key.",
                        use: "You opened the door",
                        drop: "You dropped the key."
                    }
                    "table": {
                        // Since this is a js file why not use the benefits of javascripts?
                        look: function(state) {
                                // Use the helper function to iterate over the inventory to find an item.
                                let key = helpers.findItemInInventory(state.inventory, "key");
                                if (key) {
                                    // If key is in the inventory, obviously it is not on the table.
                                    return "Table is empty";
                                }
                                return "There is a key on the table.";
                        }
                    }
                }
            }
        }
    }
}
```
## Game engine commands

Commands are defined in the [wit.ai/adventure-actions](https://wit.ai/msusur/adventure-actions) and exported to `./wit-entities` folder as json files. Application is trained to understand Turkish but it can easily be trained using other languages as long as the same entities and intents are used. 

### Intents
Intents analysed by wit.ai are converted into game commands. You can see the list of the defined commands in the [./src/commands.js](./src/engine/commands.js) file. However some of them aren't implemented yet.

1. Greeting
2. DropItem
3. Look
4. Move
5. Open
6. TakeItem
7. Use


# Contribution

I started to this project with a huge enthusiasm but couldn't spend enough time to finish and test it. Feel free to do whatever you want with it, or help yourself to fork and implement the missing bits.

Mention me in a tweet if you find this piece of work useful. [@MertSusur](https://twitter.com/mertsusur)
