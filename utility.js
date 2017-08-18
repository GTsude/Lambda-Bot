const { stripIndents } = require('common-tags');
const { owner } = require("./config.json");

const getMention = (message) =>
    message.mentions.users.size === 0 ? message.author.id : message.mentions.users.first().id;

const reportError = (bot, message, error) =>
    bot.users.get(owner).send(stripIndents `An Error has occured in '${message.guild ? message.guild.name : message.channel.name}': \`${error} @ ${error.stack}\``);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const escapeQuotes = string => string.toString().replace(/\'/gi, '\\\'');

const selfDestroyMessage = async (message, text, timer = 5000) => {
    const m = await message.reply(text);
    await sleep(timer);
    m.delete();
};

module.exports = {
    reportError,
    escapeQuotes,
    getMention,
    sleep,
    selfDestroyMessage
};
