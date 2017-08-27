
const {
    createSelectQuery
} = require("../database.js");
const {
    selfDestroyMessage,
    simpleMessageEmbed,
    escapeQuotes
} = require("../utility.js");
const {
    prefix
} = require("../config.json");

module.exports = {
    name: 'custom_reactions',
    help: 'you say A, the bot says B',
    usage: `this module is executed automatically. see "${prefix}help customreactions" on how this module works`,
    onMessage: async ({bot, connection, message}) => {
        if ( message.author.id === bot.user.id ) return;
        connection.query(createSelectQuery('customreactions', `triggerText = '${message.content.replace(/['\\]/g,'')}' AND guildID = '${message.guild.id}'`), (err, rows) => {
            if ( err ) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`Something went wrong! \`${err}\``)});

            if ( rows.length !== 0 ) {
                message.channel.send(rows[Math.floor(Math.random() * rows.length)].reactionText);
            }
        });
    },
};
