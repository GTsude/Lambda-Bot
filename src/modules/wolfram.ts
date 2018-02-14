import * as moment from 'moment';
import { simpleEmbed, selfDestroyMessage, simpleMessageEmbed } from '../utility';

import * as WolframAlpha from 'wolfram-alpha';
const Wolfram = WolframAlpha.createClient("874JJ5-PJ3E7AU3RX");

import * as Discord from 'discord.js';

module.exports = <IMod> {
    name: 'wolfram',
    match: /^(wolfram) (.+)$/g,
    nearmatch: /^wolfram/g,
    usage: 'wolfram <query>',
    run: async ({message, matches}) => {
        console.log(Wolfram);

        const query = matches[2];

        const results = await Wolfram.query(matches[2]);

        const embed = simpleEmbed('Wolfram');

        for ( const pod of results ) {
            embed.addField(pod.title, pod.subpods[0].text || "N/A");
        }

        await message.channel.send({embed});
    },
};
