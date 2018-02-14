import * as moment from 'moment';
import * as request from "request";
import * as R from "ramda";

import { simpleMessageEmbed, selfDestroyMessage, simpleEmbed } from '../utility';

const boorufy = (str: string) => str ?
    R.pipe(
        R.split(","), // Split string by comma
        R.map( // For each string
            R.pipe( // Do these three functions
                R.trim, // First trim
                R.split(' '), // Split by space
                R.join('_'), // Join with underscore
            ),
        ),
        R.join(" "), // Finally join the string by spaces again (instead of commas)
    )(str) : '';

const websites = {
    konachan: (query) => new Promise((resolve, reject) => {
        const url = `https://konachan.com/post.json?limit=1&tags=order:random rating:explicit ${query}`;

        request(url, (err, res, data) => {
            const result = JSON.parse(data);

            if (result.length > 0) {
                resolve(simpleEmbed(`Konachan`).setImage(`http:${result[0].file_url}`));
            } else {
                resolve(simpleMessageEmbed(`Whoops! We couldn't find ${query}`));
            }

        });
    }),
    danbooru: (query) => new Promise((resolve, reject) => {
        const url = `https://danbooru.donmai.us/posts.json?limit=1&tags=order:random ${query}`;

        request(url, (err, res, data) => {
            const result = JSON.parse(data);

            if (result.length > 0) {
                resolve(simpleEmbed(`Danbooru`).setImage(`https://danbooru.donmai.us${result[0].file_url}`));
            } else {
                resolve(simpleMessageEmbed(`Whoops! We couldn't find ${query}`));
            }

        });
    }),
    e621: (query) => new Promise((resolve, reject) => {
        const url = `http://e621.net/post/index.json?limit=1&tags=order:random ${query}`;

        request({ headers: { 'User-Agent': 'request.js' }, url }, (err, res, data) => {
            const result = JSON.parse(data);

            if (result.length > 0) {
                resolve(simpleEmbed(`e621`).setImage(`${result[0].file_url}`));
            } else {
                resolve(simpleMessageEmbed(`Whoops! We couldn't find ${query}`));
            }

        });
    }),
    atfbooru: (query) => new Promise((resolve, reject) => {
        const url = `https://atfbooru.ninja/posts.json?limit=1&tags=order:random ${query}`;

        request({ headers: { 'User-Agent': 'request.js' }, url }, (err, res, data) => {
            const result = JSON.parse(data);

            if (result.length > 0) {
                resolve(simpleEmbed(`atfbooru`).setImage(`https://atfbooru.ninja${result[0].file_url}`));
            } else {
                resolve(simpleMessageEmbed(`Whoops! We couldn't find ${query}`));
            }

        });
    }),
    reddit: (query) => new Promise((resolve, reject) => {
        const url = `https://www.reddit.com/r/${query}/random.json`;

        request(url, { method: 'HEAD', followAllRedirects: true }, (err, response, data) => {
            const actualURL = response.request.href;

            request({ headers: { 'User-Agent': 'request.js' }, url: actualURL }, (err, res, data) => {
                const result = JSON.parse(data);

                if (result[0].data.children[0].data.post_hint !== 'image') return resolve(websites.reddit(query));

                if (result.length > 0) {
                    return resolve(simpleEmbed(`reddit`).setImage(`${result[0].data.children[0].data.url}`));
                } else {
                    return resolve(simpleMessageEmbed(`Whoops! We couldn't find ${query}`));
                }

            });
        });
    }),
    // https://www.reddit.com/r/nsfw/random.json
    list: () => Promise.resolve(simpleMessageEmbed(`The available lewds sources are: \`${R.join(", ")(R.keys(R.dissoc('list', websites)))}\``)),
};

module.exports = {
    name: 'nsfw',
    match: /^(nsfw) ([A-z0-9]+) *(.+)*/gi,
    nearmatch: /^nsfw/gi,
    usage: 'nsfw <website> [tags]',
    run: async ({ message, matches }) => {
        // if ( !message.channel.nsfw ) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`You can only use this command in nsfw channels.`)});
        const [, , website, query] = matches;

        // Check if website even exists
        if (R.contains(R.toLower(website))(R.keys(websites))) {
            const websiteFn = websites[R.toLower(website)];

            await message.channel.startTyping();

            const embed = await websiteFn(boorufy(query));

            await message.channel.send({ embed });

            return await message.channel.stopTyping();
        } else {
            return selfDestroyMessage(message, { embed: simpleMessageEmbed(`That website does not exist, please choose from \`${R.join(", ")(R.keys(websites))}\``) });
        }
    },
};
