import { getMention, selfDestroyMessage, simpleEmbed } from "../../utility";

module.exports = {
    name: 'donate',
    match: /^(donate|sendmoney)\ ([0-9]+)\ (.+)/gi,
    usage: 'donate <amount> <mention>',
    nearmatch: /^(donate|sendmoney).*/gi,
    run: async ({bot, message, matches, connection}) => {
        const amount = parseInt(matches[2], 10);
        const receiverID = getMention(message);

        const notYourselfEmbed = simpleEmbed().addField("Error", "You can't give money to yourself, goofball");
        if (receiverID === message.author.id) return selfDestroyMessage(message, "You can't give money to yourself, goofball");

        const [[[sender]], [[receiver]]] = await Promise.all([
            await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]),
            await connection.execute("SELECT * FROM users WHERE id = ?", [receiverID]),
        ]);

        const notEnoughEmbed = simpleEmbed().addField("Error", `You do not have enough money! You have **$${sender.balance}**!`);
        if (sender.balance < amount) return selfDestroyMessage(message, {embed: notEnoughEmbed});

        await connection.execute("UPDATE users SET balance = balance - ? WHERE id = ?", [
            amount,
            sender.id,
        ]);

        await connection.execute("UPDATE users SET balance = balance + ? WHERE id = ?", [
            amount,
            receiver.id,
        ]);

        const embed = simpleEmbed()
            .setTitle("Lambda - Transaction")
            .addField("A transaction was succesfully completed", "\u200B", true)
            .addField("Transaction Details", `(λ **${amount}**) ${bot.users.get(sender.id).username} → ${bot.users.get(receiver.id).username}`)
            .setTimestamp(new Date());

        await message.channel.send({embed});
    },
};
