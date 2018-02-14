import { getMention, simpleEmbed, numberWithCommas } from '../../utility.js';

import config from '../../config';

import * as Discord from 'discord.js';

module.exports = <IMod> {
    name: 'balance',
    match: /(^money|^balance|^bal|^\$)/gi,
    usage: 'balance',
    run: async ({ message, connection, bot }) => {
        const search = getMention(message);
        const [[user]] = <any> await connection.execute("SELECT * FROM users WHERE id = ?", [search]);
        const embed = simpleEmbed()
            .setTitle(`${config['botName']} - Balance`)
            .setThumbnail(bot.users.get(user.id).avatarURL)
            .addField(`${bot.users.get(user.id).username}'s balance`, `**${config['currencySymbol']} __${numberWithCommas(user.balance)}__**.`);

        message.channel.send({ embed });
    },
};
