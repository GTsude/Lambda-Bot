const { findModule, createArgs, calculatePermissionLevel } = require("../modules.js");
const { stripIndents } = require('common-tags');
const { simpleEmbed, simpleMessageEmbed, selfDestroyMessage } = require('../utility.js');

module.exports = {
    name: 'help',
    match: /^help\ *(\w+)*$/gi,
    usage: 'help [command]',
    help: 'You\'re not supposed to ask how to use this command, you goofball.',
    run: ({message, mods}) => {
        const args = createArgs(message);
        if (args.length === 1) {
            const cmds = mods.map(c => c.name === c.usage ? c.name : `${c.name}: ${c.usage}`).join('\n');

            const embed = simpleEmbed('Help')
                .addField("Description", `Use \`help [command]\` to find more information about specific modules.`)
                .addField("Commands", `${mods.filter(m => m.permissionLevel <= calculatePermissionLevel(message)).map(m => `**${m.name}**`).join(", ")}`);

            message.channel.send({embed});
        } else {
            const command = findModule(mods, args[1]);

            if ( command ) {
                const embed = simpleEmbed('Help')
                    .addField("Usage", `\`${command.usage}\``)
                    .addField("Help", stripIndents`${command.help}`)
                    .addField("Description", command.description);

                    message.channel.send({embed});
            } else {
                const embed = simpleMessageEmbed("Command not found!");

                selfDestroyMessage(message, embed);
            }
        }
    }
};
