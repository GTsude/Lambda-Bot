import { createArgs } from "../modules";
import * as Discord from 'discord.js';

const deleteEverything = async (channel: Discord.TextChannel): Promise<boolean> => {
    const messages = await channel.fetchMessages({limit: 100});

    return messages.size === 100 ? await deleteEverything(channel) : true;
};

module.exports = {
    name: 'purge',
    match: /^(purge)\ *([0-9])*$/gi,
    usage: 'purge [message]',
    permissionLevel: 100,
    run: async ({message, matches, bot}) => {
        const args = createArgs(message);

        if (args[1] === 'all') return deleteEverything(message.channel);

        const purgeAmount = parseInt(args[1], 10) || 5;

        const messages = await message.channel.fetchMessages({
            limit: purgeAmount,
        });

        await message.channel.bulkDelete(messages);
    },
};
