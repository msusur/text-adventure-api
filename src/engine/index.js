const Parser = require('./parser');
const readline = require('readline');


const parser = new Parser();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
}); 
rl.question('Bana bir sey soyle?', (answer) => {
    parser.parseCommand(answer).then((command) => {
        console.log(`Action: ${command.action}. Entity: ${command.entities}`);
    });
});