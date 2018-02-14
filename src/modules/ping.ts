import * as moment from 'moment';
import { simpleEmbed } from '../utility';

import * as Discord from 'discord.js';

module.exports = <IMod> {
    name: 'ping',
    match: /^ping$/g,
    nearmatch: /^ping/g,
    usage: 'ping',
    run: async ({message}) => {
        const embed = simpleEmbed()
            .addField("Pong!", "Yay!");

        const date = moment();
        const m = <Discord.Message> await message.channel.send({embed});

        const newEmbed = simpleEmbed()
            .addField(`Pong!`, `Took \`${moment(m.createdTimestamp).valueOf() - date.valueOf()}\` ms`);

        m.edit({embed: newEmbed});
    },
};
