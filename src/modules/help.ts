import { findModule, createArgs, calculatePermissionLevel } from "../modules";
import { stripIndents } from 'common-tags';
import { simpleEmbed, simpleMessageEmbed, selfDestroyMessage } from '../utility';

module.exports = {
    name: 'help',
    match: /^(help|\?)\ *(\w+)*$/gi,
    usage: 'help [command]',
    help: `You're not supposed to ask how to use this command, you goofball.`,
    run: ({message, mods}) => {
        const args = createArgs(message);
        if (args.length === 1) {
            const embed = simpleEmbed()
                .setTitle("Lambda - Help")
                .addField("Description", `Use \`help [command]\` to find more information about specific modules.`)
                .addField("Commands", `${mods.filter(m => m.isCommand && m.permissionLevel <= calculatePermissionLevel(message)).map(m => `**${m.name}**`).join(", ")}`);

            message.channel.send({embed});
        } else {
            const command = findModule(mods, args[1]);

            if ( command ) {
                const embed = simpleEmbed()
                    .setTitle("Lambda - Help")
                    .addField("Usage", `\`${command.usage}\``)
                    .addField("Help", stripIndents`${command.help}`)
                    .addField("Description", command.description);

                message.channel.send({embed});
            } else {
                const embed = simpleMessageEmbed("Command not found!");

                selfDestroyMessage(message, embed);
            }
        }
    },
};
