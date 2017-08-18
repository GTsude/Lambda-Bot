const moment = require('moment');

module.exports = {
    name: 'ping',
    match: /^ping$/g,
    usage: 'ping',
    run: async({message}) => {
        const date = moment();
        const m = await message.channel.send("Ping!");

        m.edit(`Ping! Took \`${moment(m.timestamp) - date}\` ms`);
    }
};
