const R = require("ramda");
const path = require("path");
const {
    getUser,
    updateUser
} = require("../database.js");
const {
    selfDestroyMessage
} = require("../utility.js");

module.exports = {
    name: 'flowergame',
    match: /^(flowergame)\ ([A-z]+)\ ([0-9]+)/gi,
    nearmatch: /^(flowergame)/gi,
    usage: 'flowergame <hot/cold> <bet amount>',
    help: `-------------**Hot** or **cold**-------------
    A flower will be planted, depending on the color of the flower you win or lose.\n
    **Hot flowers**: red, orange, yellow, violet.
    **Cold flowers**: blue, purlple, pastels, green.
    **Bot wins**: rainbow.
    **Return bet**: black, white`,
    description: 'Choose hot or cold. If you guess correctly you will recieve your bet *2',
    run: async({ message, matches, connection }) => {
        const player = await getUser(connection, message.author.id);
        const [ _, cmd, temperature, strBet ] = matches;

        const bet = parseInt(strBet, 10);

        if (temperature !== 'hot' && temperature !== 'cold') return selfDestroyMessage(message, `Please choose either \`\`hot\`\` or \`\`cold\`\``);
        if (player.balance < bet) return selfDestroyMessage(message, `You do not have enough money! You have **$${player.balance}**!`);

        const flowers = ['red', 'orange', 'yellow', 'violet', 'blue', 'purple', 'pastels', 'green', 'black', 'white', 'rainbow'];
        const flower = flowers[Math.floor(Math.random() * flowers.length)];

        const win = (flower === 'black' || flower === 'white')
                    ? 0
                  : (temperature === 'hot'  && R.contains(flower)(['red', 'orange', 'yellow', 'violet'])) ||
                    (temperature === 'cold' && R.contains(flower)(['blue', 'purple', 'pastels', 'green']))
                    ? bet
                  : -bet;

        console.log(win);

        await updateUser(connection, player.id, $ => ({
            balance: $.balance + win
        }));

        // Send the message

        await message.channel.send({file: `./resources/flowers/${flower}.png`});
        await message.channel.send(win === 0 ? `Your bet of **$${matches[3]}** has been returned to you` :
            win === 1 ? `Correct! You recieved **$${matches[3] * 2}**!` :
            `Better luck next time! You lost **$${matches[3]}**`);
    }
};
