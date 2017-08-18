const { findModule, createArgs } = require("../modules.js");
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'help',
    match: /^help\ *(\w+)*$/gi,
    nearmatch: /^help/gi,
    usage: 'help [command]',
    help: 'You\'re not supposed to ask how to use this command, you goofball.',
    run: ({message, commands}) => {
        const args = createArgs(message);
        if (args.length === 1) {
            const cmds = commands.map(c => c.name === c.usage ? c.name : `${c.name}: ${c.usage}`).join('\n');

            message.reply(stripIndents `Use \`help [command]\` to find more information about specific commands.
                The currently available commands are: \`\`\`json
                ${cmds}\`\`\`
                `);
        } else {
            const command = findModule(commands, args[1]);

            return command ? message.reply(stripIndents `**${command.name}**
                Usage: \`${command.usage}\`
                '${command.help}'`) :
                message.reply("Command not found!");
        }


    }
};
