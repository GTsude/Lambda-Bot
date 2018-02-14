import { simpleEmbed, selfDestroyMessage, numberWithCommas, osuApi } from "../../utility";
import { stripIndents } from 'common-tags';
import * as osu from "node-osu";
import * as R from "ramda";

module.exports = {
    name: 'osu\!profile',
    match: /^(osu) (profile) ?([A-z0-9\_]+)?/gi,
    usage: 'profile <optional: username>',
    isCommand: false,
    run: async ({message, connection, matches}) => {
        // See wether a username has been provided or one has to be retrieved from the DB.osuprofile
        const osuUsername = (matches[3] === undefined) ?
                (await connection.execute("SELECT username FROM osuprofile WHERE UserID = ? AND guildID = ?", [message.author.id, message.guild.id]))[0][0]
                : {username : matches[3]};

        // Profile name not given and not found in db
        if (!osuUsername) return selfDestroyMessage(message, "Username not found! Please use \`\`osu link <username>\`\` to link your profile!");

        // Get user from osu Api
        const profile = <IOsuUser> await osuApi.getUser({u: osuUsername.username});

        console.log(profile);

        // Set links for the "More about username"
        const osuprofile = `[osu!profile](<https://osu.ppy.sh/u/${profile.id}>)`;
        const osutrack = `[osu!track](<https://ameobea.me/osutrack/user/${profile.name}>)`;
        const osustats = `[osu!stats](<https://osustats.ppy.sh/u/${profile.name}>)`;
        const osuskills = `[osu!skills](<http://osuskills.tk/user/${profile.name}>)`;
        const osuchan = `[osu!chan](<https://syrin.me/osuchan/u/${profile.id}/?m=0>)`;

        // Construct embed
        const embed = simpleEmbed(`Stats for ${profile.name}`)
            .setThumbnail(`http://s.ppy.sh/a/${profile.id}`)
            .addField(`Performance: ${numberWithCommas(profile.pp.raw)}pp (#${numberWithCommas(profile.pp.rank)}) :flag_${R.toLower(profile.country)}: #${numberWithCommas(profile.pp.countryRank)}`,
            stripIndents `Ranked Score: ${numberWithCommas(profile.scores.ranked)}
            Total Score: ${numberWithCommas(profile.scores.total)}
            Hit Accuracy: ${Math.floor(parseFloat(profile.accuracy) *  1000) / 1000}
            Play Count: ${numberWithCommas(profile.counts.plays)}
            Level: ${profile.level}
            SS: ${numberWithCommas(profile.counts.SS)}, S: ${numberWithCommas(profile.counts.S)}, A: ${numberWithCommas(profile.counts.A)}`)
            .addField(`More about ${profile.name}`, `${osuprofile} | ${osutrack} | ${osustats} | ${osuskills} | ${osuchan}`);

        await message.channel.send({embed});
    },
};
