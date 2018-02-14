import { getMention, simpleEmbed, numberWithCommas } from "../../utility";

// Level system using triangle numbers.
export const levelRequirement = (level: number) => level * 1000;
export const accLevelRequirement = (level: number) => 1000 * level * (level + 1) / 2;

// Please accept this formula, it works.... It's not good... But it works :P
export const calculateLevelFromAcc = (acc: number) => Math.floor((1 / 2) * (Math.sqrt(8 * (acc / 1000) + 1) - 1));

module.exports = {
    name: 'level',
    match: /^level|^lvl/gi,
    usage: 'level',
    help: 'Use this to see your level',
    run: async ({message, connection, bot}) => {
        try {
            const search = getMention(message);
            const [[user]] = await connection.execute("SELECT * FROM users WHERE id = ?", [search]);
            const level = calculateLevelFromAcc(user.experience);
            const req = levelRequirement(level + 1);
            const nextLevelExperience = req - (accLevelRequirement(level + 1) - user.experience);

            const embed = simpleEmbed()
                .setTitle('Lambda')
                .setThumbnail(bot.users.get(search).avatarURL)
                .addField("Level", numberWithCommas(level))
                .addField("Experience", numberWithCommas(user.experience))
                .addField("Progression", `${numberWithCommas(nextLevelExperience)}/${numberWithCommas(req)}`);

            message.channel.send({embed});
        }catch(e) {
            console.error(e);
        }
    },
};
