const { getUser, updateUser } = require("../database.js");
const { selfDestroyMessage } = require("../utility.js");

module.exports = {
    name: 'rewards',
    help: 'When you react :up: on a message, you reward a user!',
    usage: ':up:',
    onMessage: async ({message}) => {
        if ( message.attachments.size >= 1 ) message.react("🆙");
    },
    onMessageReactionAdd: async ({messageReaction, user, connection}) => {
        if ( messageReaction.emoji.name !== '🆙') return;
        if ( messageReaction.message.author.id === user.id ) return selfDestroyMessage(messageReaction.message, "You can not :up: yourself!");
        if ( user.bot || messageReaction.message.author.bot ) return;

        const upvoter = await getUser(connection, user.id);
        const receiver = await getUser(connection, messageReaction.message.author.id);

        if ( upvoter.balance < 5 ) {
            return selfDestroyMessage(messageReaction.message, `**${user.username}** you don't have enough money to reward **${messageReaction.message.author.username}**. You need **$5**!`);
        } else {
            await updateUser(connection, upvoter.id, $ => ({
                balance: $.balance - 5
            }));
            const mExp = Math.floor(Math.random() * 100);

            await updateUser(connection, receiver.id, $ => ({
                balance: $.balance + 5,
                experience: $.experience + mExp
            }));

            return messageReaction.message.channel.sendMessage(`**${user.username}** you rewarded **${messageReaction.message.author.username}** for their post. As a result they gained **$5** and **${mExp} EXP**!`);
        }
    }
};
