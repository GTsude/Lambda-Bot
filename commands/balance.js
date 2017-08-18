const { getMention, reportError } = require('../utility.js');
const { getUser } = require("../database.js");

module.exports = {
    name: 'balance',
    match: /(^money|^balance|^bal|^\$)/gi,
    usage: 'balance',

    run: ({message, connection, bot}) => {
        const search = getMention(message);
        getUser(connection, search).then(user => {
            message.channel.send(`**${bot.users.get(user.id).username}** has **$${user.balance}**.`);
        }).catch(e => reportError(bot, message, e));
    }
};
