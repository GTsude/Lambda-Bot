const { findModule, createArgs, calculatePermissionLevel } = require("../modules.js");
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'help',
    match: /^help\ *(\w+)*$/gi,
    usage: 'help [command]',
    help: 'You\'re not supposed to ask how to use this command, you goofball.',
    run: ({message, mods}) => {
        const args = createArgs(message);
        if (args.length === 1) {
            const cmds = mods.map(c => c.name === c.usage ? c.name : `${c.name}: ${c.usage}`).join('\n');

            message.reply(stripIndents `Use \`help [command]\` to find more information about specific modules.
                The currently available modules are:
                ${mods.filter(m => m.permissionLevel <= calculatePermissionLevel(message)).map(m => `**${m.name}**`).join(", ")}`);
        } else {
            const command = findModule(mods, args[1]);

            return command ? message.reply(stripIndents `**${command.name}**
                Usage: \`${command.usage}\`
                '${command.help}'`) :
                message.reply("Command not found!");
        }


    }
};
