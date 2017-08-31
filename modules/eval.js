const database = require('../database.js');
const ownership = require("../ownership.js");
const modules = require("../modules.js");
const config = require("../config.json");

module.exports = {
    name: 'eval',
    match: /^(eval|\!)\ (.+)/gi,
    usage: 'eval <code>',
    nearmatch: /^(eval|\!)/gi,
    permissionLevel: 1000,
    run: async (params) => {
        const { connection, message, matches, bot} = params;

        // Clean stuff, idk, not important
        const clean = (text) => {
            return (typeof(text) === "string") ?
                text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) :
                text;
        };

        // Get code.
        const code = matches[2];

        // Catch nasty errors and put them into the chat!
        const logError = error => {
            message.channel.send("`ERROR` ```fix\n" +
                clean(error) +
                "\n```");
        };

        try {
            // Async function, to allow for easier shit to be done.
            const evaled = eval(`( async _ => ${code} )()`);

            // Check if is a Promise (this is the only way to do it, following Promise standard)
            if ( evaled.then ) {
                // Wait for callback
                evaled.then(res => {
                    const post = typeof evaled !== 'string' ? require('util').inspect(res) : res;

                    message.channel.send("```xl\n" + clean(post) + "\n```");
                }).catch(logError);
            } else {
                // It's not a promise, so just do stuff
                const post = typeof evaled !== 'string' ? require('util').inspect(evaled) : evaled;

                message.channel.send("```xl\n" + clean(post) + "\n```");
            }
        } catch (err) {
            logError(err);
        }
    }
};
