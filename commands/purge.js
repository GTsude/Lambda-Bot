const { createArgs } = require("../modules.js");
const { reportError } = require("../utility.js");

module.exports = {
    name: 'purge',
    match: /^purge\ *([0-9])*$/gi,
    usage: 'purge [messages]',
    permissionLevel: 0,
    run: ({message, matches}) => {
        const args = createArgs(message);

        const purgeAmmount = args.length === 1 ? 20 : args[1];

        const legal = message.member.hasPermission('MANAGE_MESSAGES');

        if (!legal) return message.reply("You are not allowed to delete messages");

        message.channel.fetchMessages({
            limit: purgeAmmount
        }).then(messages =>
            message.channel.bulkDelete(messages)).catch(e => reportError(bot, message, e));
    }
};
