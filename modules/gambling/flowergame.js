const R = require("ramda");
const path = require("path");
const {
    getUser,
    updateUser
} = require("../../database.js");
const {
    selfDestroyMessage,
    simpleEmbed,
    simpleMessageEmbed
} = require("../../utility.js");
const {
    currencySymbol,
    botName
} = require('../../config.json');

module.exports = {
    name: 'flowergame',
    match: /^(fg|flowergame)\ ([A-z]+)\ ([0-9]+)/gi,
    nearmatch: /^(fg|flowergame)/gi,
    usage: 'flowergame <hot/cold> <bet amount>',
    help: `-------------**Hot** or **cold**-------------
    A flower will be planted, depending on the color of the flower you win or lose.\n
    **Hot flowers**: red, orange, yellow, violet.
    **Cold flowers**: blue, purlple, pastels, green.
    **Bot wins**: rainbow.
    **Return bet**: black, white`,
    description: 'Choose hot or cold. If you guess correctly you will recieve your bet *2',
    run: async({ message, matches, connection }) => {
        const [[player]] = await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);
        const [ _, cmd, temperature, strBet ] = matches;

        const bet = parseInt(strBet, 10);

        if (!R.contains(temperature)(['hot', 'cold'])) return selfDestroyMessage(message, simpleMessageEmbed(`Please choose either \`\`hot\`\` or \`\`cold\`\``));
        if (player.balance < bet) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`You do not have enough money! You have **${currencySymbol}${player.balance}**!`)});

        const flowerMappings = {
            'red': [255, 0, 0],
            'orange': [255, 128, 0],
            'yellow': [255, 255, 0],
            'violet': [255, 0, 255],
            'blue': [0, 0, 255],
            'purple': [200, 0, 200],
            'pastels': [100, 255, 100],
            'green': [0, 255, 0],
            'black': [0, 0, 0],
            'white': [255, 255, 255],
            'rainbow': [128, 128, 128]
        };
        const flowers = Object.keys(flowerMappings);
        const flower = flowers[Math.floor(Math.random() * flowers.length)];

        // Calculate profit/loss
        const win = (flower === 'black' || flower === 'white')
                    ? 0
                  : (temperature === 'hot'  && R.contains(flower)(['red', 'orange', 'yellow', 'violet'])) ||
                    (temperature === 'cold' && R.contains(flower)(['blue', 'purple', 'pastels', 'green']))
                    ? bet
                  : -bet;

        // Modify player
        await connection.execute("UPDATE TABLE users SET balance = ? WHERE id = ?", [
            player.balance + win,
            player.id
        ]);

        const embed = simpleEmbed("Flower Game")
            .attachFile(`./resources/flowers/${flower}.png`)
            .addField(win === 0 ? `Your bet of **${currencySymbol}${matches[3]}** has been returned to you` :
                win >= 1 ? `Correct! You recieved **${currencySymbol}${win}**!` :
                `Better luck next time! You lost **${currencySymbol}${-win}**`, '\u200B')
            .setColor(flowerMappings[flower]);

        await message.channel.send({embed});
    }
};
