const { stripIndents } = require('common-tags');
const { owner } = require("../config.json");

const getMention = (message) =>
    message.mentions.users.size === 0 ? message.author.id : message.mentions.users.first().id;

const reportError = (bot, message, error) =>
    bot.users.get(owner).send(stripIndents `An Error has occured in '${message.guild ? message.guild.name : message.channel.name}': \`${error} @ ${error.stack}\``);

const escapeQuotes = string => string.toString().replace(/\'/gi, '\\\'');

module.exports = {
    reportError,
    escapeQuotes,
    getMention
};
