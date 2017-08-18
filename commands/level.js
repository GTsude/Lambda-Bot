const { getUser } = require("../database.js");
const { getMention } = require("../utility.js");

// Level system using triangle numbers.
const levelRequirement = level => level * 1000;
const accLevelRequirement = level => 1000 * level * (level + 1) / 2;

// Please accept this formula, it works.... It's not good... But it works :P
const calculateLevelFromAcc = acc => Math.floor((1 / 2) * (Math.sqrt(8 * (acc / 1000) + 1) - 1));

module.exports = {
    name: 'level',
    match: /^level|^lvl/gi,
    usage: 'level',
    help: 'Use this to see your level',
    run: async({message, connection, bot}) => {
        try {
            const search = getMention(message);
            const user = await getUser(connection, search);
            const level = calculateLevelFromAcc(user.experience);
            const req = levelRequirement(level + 1);
            const nextLevelExperience = accLevelRequirement(level + 1) - user.experience;
            message.channel.send(`**${bot.users.get(user.id).username}** is level **${level}**. [${nextLevelExperience}/${req}].`);
        }catch(e) {
            console.error(e);
        }
    }
};
