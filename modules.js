const R = require('ramda');

const {
    prefix,
    masters
} = require("./config.json");

const { selfDestroyMessage } = require("./utility.js");

const { stripIndents } = require("common-tags");

// TODO: Relocate and reimplement
const calculatePermissionLevel = message => R.contains(message.author.id)(masters) ? 1000 : 0;

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
            if (command.permissionLevel > calculatePermissionLevel(message) ) {
                return selfDestroyMessage(message, "Oh noes! It looks like you do not have permission to use this command!").catch(console.error);
            } else {
                command.run(R.merge(params, {
                    matches
                }));
            }
        }
        else if (command.nearmatch && command.nearmatch.exec(sub)) {
            selfDestroyMessage(message, `The correct usage is \`${command.usage}\``).catch(console.error);
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
