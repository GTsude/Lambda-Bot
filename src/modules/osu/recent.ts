import { simpleEmbed, numberWithCommas, selfDestroyMessage, osuApi } from "../../utility";
import { stripIndents } from 'common-tags';
import * as R from "ramda";
import * as moment from "moment";

module.exports = {
    name: 'osu!recent',
    match: /^(osu) (recent) ([A-Z]+)?/gi,
    nearmatch: /^(osu) (recent)/gi,
    usage: 'recent <optional: username>',
    isCommand: false,
    run: async ({message, matches}) => {
        // Osu api calls
        const profile = await osuApi.getUser({u: `${matches[3]}`});
        const recentScore = (await osuApi.getUserRecent({u: profile.name}))[0];
        const beatmap = (await osuApi.getBeatmaps({b: recentScore.beatmapId}))[0];

        // Beatmap specific info
        const bmDifficulty = beatmap.difficulty;
        const bmLengthMinutes = Math.floor(beatmap.time.total / 60);
        const bmLengthSeconds = beatmap.time.total - bmLengthMinutes * 60;
        const bmLengthSecondsLeadingZero = (bmLengthSeconds < 10) ? `0${bmLengthSeconds}` : bmLengthSeconds;

        // Score specific info
        const amount50 = parseInt(recentScore.counts['50'], 10);
        const amount100 = parseInt(recentScore.counts['100'], 10);
        const amount300 = parseInt(recentScore.counts['300'], 10);
        const amountMiss = parseInt(recentScore.counts.miss, 10);

        const hitPoints = amount50 * 50 + amount100 * 100 + amount300 * 300;
        const maxHitPoints = (amountMiss + amount50 + amount100 + amount300) * 300;

        const stdAccuracy = hitPoints / maxHitPoints * 100;

        console.log(recentScore);

        // Construct and send embed for standard TODO: add more info like accuracy and oppai implementation
        const embed = simpleEmbed(`${profile.name}'s score:`)
            .addField(`Beatmap info:`,
            stripIndents `**[${beatmap.title}[${beatmap.version}]](<https://osu.ppy.sh/b/${beatmap.id}>)**
            **Mapper:** [${beatmap.creator}](<https://osu.ppy.sh/u/${beatmap.creator.replace(/ /gi, "%20")}>)
            **Song:** ${beatmap.title} - ${beatmap.artist}
            **Stats:** 🎶${beatmap.bpm} | 🌟${Math.round(bmDifficulty.rating * 100) / 100} | ⌛${bmLengthMinutes}:${bmLengthSecondsLeadingZero} | CS:${bmDifficulty.size} | OD:${bmDifficulty.overall} | AR:${bmDifficulty.approach} | HP:${bmDifficulty.drain}`)
            .addField(`Performance:`,
            stripIndents `**Rank:** ${recentScore.rank} **Mods**: ${recentScore.mods.length === 0 ? 'None' : R.take(recentScore.mods.length - 1, recentScore.mods)}
            **Score:** ${numberWithCommas(recentScore.score)} (${Math.round(stdAccuracy * 1000) / 1000}%)
            **Combo:** ${numberWithCommas(recentScore.maxCombo)}/${numberWithCommas(beatmap.maxCombo)}
            **300:** ${amount300} | **100:** ${amount100} | **50:** ${amount50} | **Misses:** ${amountMiss}`)
            .setFooter(`Played on: ${moment(recentScore.date).format("YYYY-MM-DD mm:hh:ss")}`);

        await message.channel.send({embed});
    },
};
