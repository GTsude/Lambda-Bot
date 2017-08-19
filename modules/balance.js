const { getMention, reportError } = require('../utility.js');
const { getUser } = require("../database.js");

module.exports = {
    name: 'balance',
    match: /(^money|^balance|^bal|^\$)/gi,
    usage: 'balance',

    run: async ({message, connection, bot}) => {
        const search = getMention(message);
        const user = await getUser(connection, search);
        message.channel.send(`**${bot.users.get(user.id).username}** has **$${user.balance}**.`);
    }
};
