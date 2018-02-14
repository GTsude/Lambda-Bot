import { getMention, simpleEmbed } from '../../utility.js';

import config from '../../config';

import * as Discord from 'discord.js';
import * as mysql from 'mysql2/promise';

module.exports = <IMod> {
    name: 'balance',
    match: /(^money|^balance|^bal|^\$)/gi,
    usage: 'balance',
    run: async ({ message, connection, bot }) => {
        const search = getMention(message);
        const [[user]] = <any> await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);
        const embed = simpleEmbed()
            .setTitle(`${config['botName']} - Balance`)
            .setThumbnail(bot.users.get(user.id).avatarURL)
            .addField(`${bot.users.get(user.id).username}'s λCredits`, `**${config['currencySymbol']} __${user.balance}__**.`);

        message.channel.send({ embed });
    },
};
