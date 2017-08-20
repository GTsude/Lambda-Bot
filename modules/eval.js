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
    run: (params) => {
        const { connection, message, matches, bot} = params;

        const clean = (text) => { //Used in eval code I stole from someone else :) x2
            return (typeof(text) === "string") ?
                text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) :
                text;
        };

        const code = matches[2];

        try {
            const evaled = eval(`( _ => ${code} )()`);
            const post = typeof evaled !== 'string' ? require('util').inspect(evaled) : evaled;

            message.channel.send("```xl\n" + clean(post) + "\n```");
        } catch (err) {
            message.channel.send("`ERROR` ```fix\n" +
                clean(err) +
                "\n```");
        }
    }
};
