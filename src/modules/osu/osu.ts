import { simpleEmbed } from "../../utility";
import config from "../../config";

module.exports = {
    name: 'osu',
    match: /^osu$/gi,
    usage: `${config.prefix}osu`,
    help: `Global command for osu modules.`,
    description: `Use this command to get an overview of all the osu modules.`,
    run: async ({message, matches}) => {
        const embed = simpleEmbed(`osu! modules`)
        .addField(`osu!profile`, `usage: \`\`${config.prefix}osu profile <username>\`\``)
        .addField(`osu!recent`, `usage: \`\`${config.prefix}osu recent <username>\`\``)
        .addField(`osu!link`, `usage: \`\`${config.prefix}osu link <username>\`\``);

        await message.channel.send({embed});
    },
};
