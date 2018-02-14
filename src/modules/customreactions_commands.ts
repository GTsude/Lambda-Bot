import * as R from 'ramda';

import { selfDestroyMessage, simpleEmbed, simpleMessageEmbed } from '../utility.js';

import config from '../config';

const prefix = config['prefix'];

module.exports = {
    name: 'customreactions',
    match: /^(customreactions|cr) (add|remove|list)\ *("([^"]+)")* *("([^"]+)")*/gi,
    nearmatch: /^(customreactions|cr)/gi,
    permissionLevel: 1000, // Temporarily until we figure out how to do proper permissions
    usage: `${prefix}cr list "(optional trigger text)" lists all reactions or, when trigger text is provided, all reactions bound to that trigger,
${prefix}cr add "trigger text" "reaction text" to add a reaction,
${prefix}cr edit "trigger text" "old reaction text" "new reaction text" to edit a reaction and
${prefix}cr remove "trigger text" to delete a reaction.`,
    help: 'If there are multiple reactions per trigger it will simply select a random one.',
    description: 'Spice up your life with some custom reactions. You can add image links, text,... . Basically like making your own command!',
    run: async ({
        connection,
        message,
        matches,
    }) => {
        const [, , action, , trigger, , reaction] = matches;

        // Adding a custom reacion
        R.cond([
            [R.equals(`add`), async () => {
                const [rows] = await connection.execute(`SELECT * FROM customreactions WHERE triggerText = ? AND reactionText = ? AND guildID = ?`, [trigger, reaction, message.guild.id]);

                if (rows.length > 0) {
                    return selfDestroyMessage(message, {
                        embed: simpleMessageEmbed(`This combination of trigger and reaction already exists!`),
                    });
                } else {
                    await connection.execute("INSERT INTO customreactions (triggerText, reactionText, guildID) VALUES (?, ?, ?)", [trigger, reaction, message.guild.id]);

                    const embed = simpleEmbed('Custom reaction added')
                        .addField("Trigger", trigger)
                        .addField("Reaction", reaction);

                    return message.channel.send({
                        embed,
                    });

                }

            }],
            [R.equals(`remove`), async () => {
                if (!trigger || !reaction) return;
                await connection.execute("DELETE FROM customreactions WHERE triggerText = ? AND reactionText = ? AND guildID = ?", [ trigger, reaction, message.guild.id]);

                const embed = simpleEmbed('Custom reaction removed')
                    .addField("Trigger", trigger)
                    .addField("Reaction", reaction);

                return message.channel.send({
                    embed,
                });

            }],
            [R.equals(`list`), async () => {
                if (!trigger) {
                    const [rows] = await connection.execute("SELECT * FROM customreactions WHERE guildID = ?", [message.guild.id]);

                    const embed = simpleEmbed('Custom reaction');

                    if (rows.length === 0) embed.addField("This server has no custom reactions!", "\u200B");
                    else embed.addField("Info", "The following custom reactions are active on this server:");

                    R.map(row => {
                        embed.addField(row['triggerText'], row['reactionText']);
                    })(rows);

                    message.channel.send({
                        embed,
                    });
                } else {
                    const [rows] = await connection.execute("SELECT * FROm customreactions WHERE triggerText = ? AND guildID = ?", [trigger, message.guild.id]);

                    const embed = simpleEmbed('Custom reaction');

                    if (rows.length === 0) embed.addField("This trigger does not exist!", "\u200B");
                    else embed.addField("Info", `The following reactions are linked to ${trigger}:`);

                    R.map(row => {
                        embed.addField(row['triggerText'], row['reactionText']);
                    })(rows);

                    message.channel.send({ embed });
                }
            }],
        ])(action);
    },
};
