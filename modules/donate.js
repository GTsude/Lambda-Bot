const { getUser, updateUser } = require("../database.js");
const { getMention, selfDestroyMessage, simpleEmbed } = require("../utility.js");

module.exports = {
    name: 'donate',
    match: /^(donate|sendmoney)\ ([0-9]+)\ (.+)/gi,
    usage: 'donate <amount> <mention>',
    nearmatch: /^(donate|sendmoney).*/gi,
    run: async({bot, message, matches, connection}) => {
        const amount = parseInt(matches[2], 10);
        const receiverID = getMention(message);

        const notYourselfEmbed = simpleEmbed().addField("Error", "You can't give money to yourself, goofball");
        if (receiverID === message.author.id) return selfDestroyMessage(message, "You can't give money to yourself, goofball");

        const [sender, receiver] = await Promise.all([getUser(connection, message.author.id), getUser(connection, getMention(message))]);


        const notEnoughEmbed = simpleEmbed().addField("Error", `You do not have enough money! You have **$${sender.balance}**!`);
        if (sender.balance < amount) return selfDestroyMessage(message, {embed: notEnoughEmbed});

        await updateUser(connection, sender.id, $ => ({
            balance: $.balance - amount
        }));
        await updateUser(connection, receiver.id, $ => ({
            balance: $.balance + amount
        }));

        const embed = simpleEmbed()
            .setTitle("Lambda - Transaction")
            .addField("A transaction was succesfully completed", "\u200B", true)
            .addField("Transaction Details", `(λ **${amount}**) ${bot.users.get(sender.id).username} → ${bot.users.get(receiver.id).username}`)
            .setTimestamp(new Date());

        await message.channel.send({embed});
    }
};
