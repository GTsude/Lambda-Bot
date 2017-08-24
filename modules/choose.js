const R = require("ramda");

const { simpleEmbed } = require("../utility.js");

const chooseOption = options => {
	const items = options.split(',').map(R.trim); // Converts param options to array items
	return items[Math.floor(Math.random() * items.length)]; // Returns a random item
};

module.exports = {
	name: 'choose',
	match: /^(choose)\ (.+)/gi,
	usage: 'choose option1,option2,...',
	help: 'Simply seperate your possible options using commas and you\'ll get back one of them! Good luck!',
	description: 'For those occasions where you can\'t make a simple decision on your own..',
	run: async({
		message,
		matches
	}) => {
		const embed = simpleEmbed()
			.setTitle('Lambda - Choose')
			.addField("Chose", chooseOption(matches[2]));

		message.channel.send({
			embed
		}); // Call chooseOption with param matches[2]
	}
};
