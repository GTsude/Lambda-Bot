const { getUser, updateUser } = require("../database.js");
const { getMention } = require("../utility.js");

module.exports = {
    name: 'donate',
    match: /^(donate|sendmoney)\ ([0-9]+)\ (.+)/gi,
    usage: 'donate <amount> <mention>',
    nearmatch: /^(donate|sendmoney).+/gi,
    run: async({message, matches, connection}) => {
        const amount = parseInt(matches[2], 10);
        const receiverID = getMention(message);

        if (receiverID === message.author.id) return message.channel.send("You can't give money to yourself, goofball");

        const [sender, receiver] = await Promise.all([getUser(connection, message.author.id), getUser(connection, getMention(message))]);

        if (sender.balance < amount) return message.channel.send(`You do not have enough money! You have **$${sender.balance}**!`);

        await updateUser(connection, sender.id, $ => ({
            balance: $.balance - amount
        }));
        await updateUser(connection, receiver.id, $ => ({
            balance: $.balance + amount
        }));

        await message.channel.send(`You have successfully sent **$${amount}** to **${matches[3]}**!`);
    }
};
