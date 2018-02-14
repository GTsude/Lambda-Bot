import { stripIndents } from 'common-tags';

import config from './config';

import * as Discord from 'discord.js';
import * as osu from 'node-osu';
import * as R from 'ramda';

export const getMention = (message) =>
    message.mentions.users.size === 0 ? message.author.id : message.mentions.users.first().id;

// Async sleep event. usage: await sleep(5000); // will sleep for 5000ms
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Pretty obv
export const escapeQuotes = string => string.toString().replace(/\'/gi, '\\\'');

export const selfDestroyMessage = async (message, text, timer = 5000) => {
    const m = await message.channel.send(text);
    await sleep(timer);
    m.delete();
};

// Create an embed with some preset values
export const embedColorDec = rgb => rgb[0] * 65536 + rgb[1] * 256 + rgb[2];

export const simpleEmbed = (moduleName = "Info") =>
    new Discord.RichEmbed({
        color: embedColorDec((<any>config).embedColor),
        title: `${<any>config['botName']} - ${moduleName}`,
    });

export const simpleMessageEmbed = (message) =>
    new Discord.RichEmbed({
        color: embedColorDec((<any>config).embedColor),
        title: message,
    });

export const ezSQL = async (message, connection, query) => {
    message.channel.send(JSON.stringify((await connection.execute(query))[0], null, 2).slice(1, 1000));
};

export const hasRole = async (member, rolename) =>
    R.contains(rolename)(member.roles.array().map(x => x.name));

export const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const osuApi = new osu.Api(config.osuAPIKey, {
    notFoundAsError: true,
    completeScores: false,
});
