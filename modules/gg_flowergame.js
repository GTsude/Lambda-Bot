const R = require("ramda");
const { getUser, updateUser } = require("../database.js");
const { selfDestroyMessage } = require("../utility.js");

module.exports = {
    name: 'flowergame',
    match: /^(flowergame)\ ([A-z]+)\ ([0-9]+)/gi,
    nearmatch: /^(flowergame)/gi,
    usage: 'flowergame <hot/cold> <bet amount>',
    help: `\`\`\`The player has to choose hot or cold followed by his bet. \n
Three colours are designated hot (red, orange, yellow)     [bet * 2]
Three colours are designated cold (blue, purple, pastels)  [bet * 2]
Two colours are neutral (black/white)                      [bet]
One colour is an automatic win for the host (Rainbow)      [no reward]\`\`\``,
    description: 'Choose hot or cold. If you guess correctly you will recieve your bet *2',
    run: async({message, matches, connection}) => {
        const player = await Promise.all(getUser(connection, message.author.id));

        if (player.balance < matches[3]) return selfDestroyMessage(message, `You do not have enough money! You have **$${player.balance}**!`);

        const flowers = ['red', 'orange', 'yellow', 'blue', 'purple', 'pastels', 'black', 'white', 'rainbow'];
        const flower = flowers[Math.floor(Math.random() * flowers.length)];

        const win = flower === 'black' || flower === 'white' ? 0:
        (matches[2] === 'hot' &&  R.contains(flower)(['red', 'orange', 'yellow'])) ||
        (matches[2] === 'cold' && R.contains(flower)(['blue', 'purple', 'pastels'])) ? 1 :  2;

        await updateUser(connection, player.id, $ => (win !== 0
            ? win === 1 && {balance: $.balance + matches[3]}
            : win === 2 && {balance: $.balance - matches[3]}
        ));

        // Send the message
        const msg = `You chose **${matches[2]}**, the seed has grown a(n) **${flower} flower**!\n`;

        await message.channel.send(msg.concat(win === 0 ? `Your bet of **$${matches[3]}** has been returned to you`
        : win === 1 ? `You guessed it! You recieved **$${matches[3] * 2}**!`
        : `Better luck next time! You lost **$${matches[3]}**`));
    }
};
