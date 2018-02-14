import * as request from 'request-promise';

import { simpleEmbed, selfDestroyMessage, simpleMessageEmbed } from '../utility';

module.exports = <IMod> {
    name: 'jisho',
    match: /^(jisho) (.+)/gi,
    nearmatch: /^jisho/gi,
    usage: 'jisho <query>',
    run: async ({message, matches}) => {
        const url = `http://jisho.org/api/v1/search/words?keyword=${encodeURI(matches[2])}`;

        const { data } = JSON.parse(await request(url));

        const embed = simpleEmbed('Jisho');

        for ( const elem of data.slice(0, 5) ) {
            const { senses } = elem;

            let english: string = '';

            for ( const sense of senses.slice(0, 5) ) {
                english += `${sense.parts_of_speech.length > 0 ? '[' + sense.parts_of_speech.join(', ') + ']' : '\t'} ${sense.english_definitions[0]}\n`;
            }

            let japanese = "";

            japanese += elem.japanese[0].word || "";
            japanese += elem.japanese[0].reading ? '[' + elem.japanese[0].reading + ']' : "";

            embed.addField(japanese, english);
        }

        await message.channel.send({embed});
    },
};
