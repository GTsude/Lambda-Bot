const moment = require('moment');
const { simpleEmbed } = require("../utility.js");

module.exports = {
    name: 'ping',
    match: /^ping$/g,
    usage: 'ping',
    run: async({message}) => {
        const embed = simpleEmbed()
            .addField("Pong!", "Yay!");

        const date = moment();
        const m = await message.channel.send({embed});

        const newEmbed = simpleEmbed()
            .addField(`Pong!`, `Took \`${moment(m.timestamp) - date}\` ms`);

        m.edit({embed: newEmbed});
    }
};
