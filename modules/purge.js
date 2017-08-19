const { createArgs } = require("../modules.js");
const { reportError } = require("../utility.js");

module.exports = {
    name: 'purge',
    match: /^purge\ *([0-9])*$/gi,
    usage: 'purge [messages]',
    permissionLevel: 100,
    run: ({message, matches, bot}) => {
        const args = createArgs(message);

        const purgeAmmount = args.length === 1 ? 20 : args[1];

        message.channel.fetchMessages({
            limit: purgeAmmount
        }).then(messages =>
            message.channel.bulkDelete(messages)).catch(e => reportError(bot, message, e));
    }
};
