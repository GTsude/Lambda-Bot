const R = require('ramda');

const {
    prefix,
    masters
} = require("./config.json");

const handleMessage = (params) => {
    const {
        connection,
        command,
        message
    } = params;
    const sub = createSub(message);
    const isPrefixed = message.content.startsWith(prefix);

    const matches = command.match.exec(sub);

    return (command.permissionLevel === -1 && R.contains(masters)(message.author.id)) ?
        0 :
        isPrefixed ?
        matches ?
        command.run(R.merge(params, {
            matches
        })) :
        command.nearmatch && command.nearmatch.exec(sub) ?
        message.reply(`The correct usage is \`${command.usage}\``) :
        false :
        false;
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
