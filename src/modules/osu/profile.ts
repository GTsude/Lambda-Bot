import { simpleEmbed, selfDestroyMessage, numberWithCommas, osuApi } from "../../utility";
import { stripIndents } from 'common-tags';
import * as osu from "node-osu";
import * as R from "ramda";

module.exports = {
    name: 'osu\!profile',
    match: /^(osu) (profile) ?([A-Z]+)?/gi,
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
        const profile = await osuApi.apiCall('/get_user', {u: osuUsername.username});

        // Deconstruct profile
        const {user_id, username, count300, count100, count50, playcount, ranked_score, total_score, pp_rank, level, pp_raw, accuracy, count_rank_ss, count_rank_s, count_rank_a, country, pp_country_rank} = profile[0];

        // Set links for the "More about username"
        const osutrack = `[osu!track](<https://ameobea.me/osutrack/user/${username}>)`;
        const osustats = `[osu!stats](<https://osustats.ppy.sh/u/${username}>)`;
        const osuskills = `[osu!skills](<http://osuskills.tk/user/${username}>)`;
        const osuchan = `[osu!chan](<;https://syrin.me/osuchan/u/${user_id}/?m=0>)`;

        // Construct embed
        const embed = simpleEmbed(`Stats for ${username}`)
            .addField(`Performance: ${numberWithCommas(pp_raw)}pp (#${numberWithCommas(pp_rank)}) :flag_${R.toLower(country)}: #${numberWithCommas(pp_country_rank)}`,
            stripIndents `Ranked Score: ${numberWithCommas(ranked_score)}
            Total Score: ${numberWithCommas(total_score)}
            Hit Accuracy: ${Math.floor(accuracy *  1000) / 1000}
            Play Count: ${numberWithCommas(playcount)}
            Level: ${level}
            SS: ${count_rank_ss}, S: ${count_rank_s}, A: ${count_rank_a}`)
            .addField(`More about ${username}`, `${osutrack} | ${osustats} | ${osuskills} | ${osuchan}`);

        await message.channel.send({embed});
    },
};
