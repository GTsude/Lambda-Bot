const { stripIndents } = require('common-tags');

const getMention = (message) =>
    message.mentions.users.size === 0 ? message.author.id : message.mentions.users.first().id;

const reportError = (bot, message, error) =>
    bot.users.get('119782414175305728').send(stripIndents `An Error has occured in '${message.guild ? message.guild.name : message.channel.name}': \`${error}\``);

const escapeQuotes = string => string.toString().replace(/\'/gi, '\\\'');

module.exports = {
    reportError,
    escapeQuotes,
    getMention
};
