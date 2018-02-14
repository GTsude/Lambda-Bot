import { getMention, simpleEmbed, numberWithCommas } from '../../utility';
import config from '../../config';

const calculateLevelFromAcc = (acc: number) => Math.floor((1 / 2) * (Math.sqrt(8 * (acc / 1000) + 1) - 1));

module.exports = <IMod> {
    name: 'profile',
    match: /^(profile)/gi,
    usage: 'profile [mention]',
    help: 'Use this command to display your or someone else\' profile',
    run: async ({message, connection, bot}) => {
        const search = getMention(message);

        const [rows] = <any> await connection.execute("SELECT * FROM users WHERE id = ?", [search]);

        const user: IUser = rows[0];

        const embed = simpleEmbed('Profile')
            .addField("Balance", `**${config.currencySymbol} __${numberWithCommas(user.balance)}__**`)
            .addField("Level", `${numberWithCommas(calculateLevelFromAcc(user.experience))}`)
            .setThumbnail(bot.users.get(search).avatarURL);

        message.channel.send({embed});
    },
};
