
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
        const [rows] = await connection.execute('SELECT * FROM customreactions WHERE triggerText = ? AND guildID = ?', [message.content, message.guild.id]);

        if ( rows.length > 0 ) {
            message.channel.send(rows[Math.floor(Math.random() * rows.length)].reactionText);
        }
    },
};
