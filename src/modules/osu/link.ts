import { simpleEmbed, selfDestroyMessage, osuApi } from "../../utility";
import * as osu from "node-osu";

module.exports = {
    name: "osu!link",
    match: /^(osu) (link)\ ([A-z0-9\_]+)/gi,
    nearmatch: /^(osu) (link)/gi,
    usage: 'link <username>',
    isCommand: false,
    run: async ({message, connection, matches}) => {
        const osuProfile = await osuApi.getUser({u: `${matches[3]}`});
        const [[usersWithName]] = await connection.execute("SELECT * FROM osuprofile WHERE userID = ? AND guildID = ?", [message.author.id, message.guild.id]);

        // No need to check if that discordID is already linked with osu username since it'll just overwrite anyways.
        if (!usersWithName) {
            // No osu profile linked with username
            await connection.execute("INSERT INTO osuprofile VALUES(?, ?, ?, ?)", [
                message.author.id,
                message.guild.id,
                osuProfile.name,
                parseFloat(osuProfile.pp.raw).toFixed(2),
            ]);
        } else {
            // Refresh old link with new username
            await connection.execute("UPDATE osuprofile SET username = ?, rawpp = ? WHERE userID = ? AND guildID = ?", [
                osuProfile.name,
                parseFloat(osuProfile.pp.raw).toFixed(2),
                message.author.id,
                message.guild.id,
            ]);
        }

        const embed = simpleEmbed()
        .addField(`osu!link success!`, `Discord **${message.author.username}** has been linked with  osu! **${osuProfile.name}** on  **${message.guild.name}**.`);

        await message.channel.send({embed});
    },
};
