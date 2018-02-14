import * as R from "ramda";

import { simpleEmbed } from "../utility.js";

module.exports = {
    name: 'choose',
    match: /^(choose)\ (.+)/gi,
    usage: 'choose option1, option2, option3, ...',
    help: `Simply seperate your possible options using commands and you'll get back one of them! Good luck!`,
    description: `For those occasions where you can't make a simple decision on your own...`,
    run: async ({message, matches}) => {
        const options: string = matches[2];
        const items = options.split(',').map(R.trim);
        const result = items[Math.floor(Math.random() * items.length)];

        const embed = simpleEmbed(`Choose`)
        .addField("Chose", result);

        message.channel.send({ embed });
    },
};
