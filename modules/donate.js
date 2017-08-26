const {
    getUser,
    updateUser
} = require("../database.js");
const {
    getMention,
    selfDestroyMessage,
    simpleEmbed
} = require("../utility.js");
const {
    currencySymbol
} = require("../config.json");

module.exports = {
    name: 'donate',
    match: /^(donate|sendmoney)\ ([0-9]+)\ (.+)/gi,
    usage: 'donate <amount> <mention>',
    nearmatch: /^(donate|sendmoney).*/gi,
    run: async({
        bot,
        message,
        matches,
        connection
    }) => {
        const amount = parseInt(matches[2], 10);
        const receiverID = getMention(message);


        if (receiverID === message.author.id) {
            const notYourselfEmbed = simpleEmbed().addField("Error", "You can't give money to yourself, goofball");
            return selfDestroyMessage(message, {
                embed: notYourselfEmbed
            });
        }

        const [sender, receiver] = await Promise.all([getUser(connection, message.author.id), getUser(connection, getMention(message))]);

        if (sender.balance < amount) {
            const notEnoughEmbed = simpleEmbed().addField("Error", `You do not have enough money! You have ${currencySymbol}**${sender.balance}**!`);

            return selfDestroyMessage(message, {
                embed: notEnoughEmbed
            });
        }

        await updateUser(connection, sender.id, $ => ({
            balance: $.balance - amount
        }));
        await updateUser(connection, receiver.id, $ => ({
            balance: $.balance + amount
        }));

        const embed = simpleEmbed('Transaction')
            .addField("A transaction was succesfully completed", "\u200B", true)
            .addField("Transaction Details", `(${currencySymbol}**${amount}**) ${bot.users.get(sender.id).username} → ${bot.users.get(receiver.id).username}`)
            .setTimestamp(new Date());

        await message.channel.send({
            embed
        });
    }
};
