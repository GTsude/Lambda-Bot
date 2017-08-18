const R = require('ramda');

const {
    prefix
} = require("./config.json");

const createCommand = (attributes) => {
    const defaults = {
        name: 'no-name',
        run: () => 0,
        match: /^...$/g,
        usage: '???',
        help: 'No help provided',
        description: 'No description provided',
        permissionLevel: 0,
    };

    return R.merge(defaults, attributes);
};

const runCommand = (params) => {
    const {
        connection,
        command,
        message
    } = params;
    const sub = createSub(message);
    const isPrefixed = message.content.startsWith(prefix);

    const matches = command.match.exec(sub);

    return (command.permissionLevel === -1 && message.author.id !== '119782414175305728') ?
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
const findCommand = (commands, test) =>
    commands.filter(command => command.name === test)[0];

module.exports = {
    createSub,
    createArgs,
    findCommand,
    createCommand,
    runCommand
};
