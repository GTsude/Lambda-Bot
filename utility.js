const {
	stripIndents
} = require('common-tags');
const {
	owner,
	botName,
	embedColor
} = require("./config.json");
const Discord = require('discord.js');
const R = require('ramda');

const getMention = (message) =>
	message.mentions.users.size === 0 ? message.author.id : message.mentions.users.first().id;

const reportError = (bot, message, error) =>
	bot.users.get(owner).send(stripIndents `An Error has occured in '${message.guild ? messagew.guild.name : message.channel.name}': \`${error} @ ${error.stack}\``);


// Async sleep event. usage: await sleep(5000); // will sleep for 5000ms
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Pretty obv
const escapeQuotes = string => string.toString().replace(/\'/gi, '\\\'');

const selfDestroyMessage = async(message, text, timer = 5000) => {
	const m = await message.channel.send(text);
	await sleep(timer);
	m.delete();
};

// Create an embed with some preset values
const embedColorDec = rgb => rgb[2] * 65536 + rgb[1] * 256 + rgb[0];

const simpleEmbed = (moduleName = "Info") =>
	new Discord.RichEmbed({
		color: embedColorDec(embedColor),
		title: `${botName} - ${moduleName}`
	});

const simpleMessageEmbed = (message) =>
    new Discord.RichEmbed({
        color: embedColorDec(embedColor),
        title: message
    });


module.exports = {
	reportError,
	escapeQuotes,
	getMention,
	sleep,
	selfDestroyMessage,
	simpleEmbed,
    simpleMessageEmbed
};
