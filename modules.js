const R = require('ramda');

const {
    prefix,
    masters
} = require("./config.json");

// Relocate and reimplement
const calculatePermissionLevel = user => R.contains(user.id)(masters) ? 1000 : 0;

const handleMessage = (params) => {
    const {
        connection,
        command,
        message,
        bot
    } = params;

    if ( message.author === bot.user ) return;

    const sub = createSub(message);
    const isPrefixed = message.content.startsWith(prefix);




    const matches = command.match.exec(sub);

    if (isPrefixed) {
        if (matches && (!command.channel || command.channel.test(message.channel.type))) {
            if (! ( R.contains(message.author.id)(masters) || command.permissionLevel > calculatePermissionLevel(message.author.id) )) {
                return message.channel.send("Oh noes! It looks like you do not have permission to use this command!");
            } else {
                command.run(R.merge(params, {
                    matches
                }));
            }
        }
        else if (command.nearmatch && command.nearmatch.exec(sub)) {
            (async() => {
                const m = await message.reply(`The correct usage is \`${command.usage}\``);
                await sleep(5000);
                m.delete();
            })();
        }
    }
};

const createSub = message => message.content.substring(prefix.length);
const createArgs = message => createSub(message).split(" ");
const findModule = (commands, test) =>
    commands.filter(command => command.name === test)[0];

module.exports = {
    createSub,
    createArgs,
    findModule,
    handleMessage
};
