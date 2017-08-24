const {
	getMention,
	reportError,
	simpleEmbed
} = require('../utility.js');
const {
	getUser
} = require("../database.js");

module.exports = {
	name: 'balance',
	match: /(^money|^balance|^bal|^\$)/gi,
	usage: 'balance',

	run: async({
		message,
		connection,
		bot
	}) => {
		const search = getMention(message);
		const user = await getUser(connection, search);
        const embed = simpleEmbed()
            .setTitle('Lambda - Balance')
            .setThumbnail(bot.users.get(user.id).avatarURL)
            .addField(`${bot.users.get(user.id).username}'s λCredits`, `**λ __${user.balance}__**.`);

		message.channel.send({embed});
	}
};
