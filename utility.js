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
const embedColorDec = rgb => rgb[0] * 65536 + rgb[1] * 256 + rgb[2];

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

const ezSQL = async (message, connection, query) => {
    message.channel.send(JSON.stringify((await connection.execute(query))[0], null, 2).slice(1, 1000));
};

const hasRole = async (member, rolename) =>
    R.contains(rolename)(member.roles.array().map( x => x.name ));


module.exports = {
	reportError,
	escapeQuotes,
	getMention,
	sleep,
	selfDestroyMessage,
	simpleEmbed,
    simpleMessageEmbed,
    hasRole
};
