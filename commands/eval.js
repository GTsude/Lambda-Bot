module.exports = {
    name: 'eval',
    match: /^(eval|\!)\ (.+)/gi,
    usage: 'eval <code>',
    nearmatch: /^(eval|\!)/gi,
    run: ({message, matches}) => {
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
