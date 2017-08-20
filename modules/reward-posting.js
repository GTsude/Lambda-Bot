const { getUser, updateUser, createNow } = require("../database.js");
const { selfDestroyMessage } = require("../utility.js");

const moment = require("moment");

module.exports = {
    name: 'rewards',
    help: 'You get rewarded for posting stuff!',
    usage: 'Yeah, you just uh... upload stuff, no commands or anything',
    onMessage: async ({connection, message}) => {
        if ( message.attachments.size >= 1 && message.guild.memberCount >= 5 ) {
            console.log("An image was attached!");
            const user = await getUser(connection, message.author.id);
            const now = moment();
            const then = moment(user.lastimage_timestamp);

            console.log(now, then, now - then);

            if ( now - then < 60 * 1000 ) return;

            updateUser(connection, message.author.id, $ => ({
                balance: $.balance + 5,
                experience: $.experience + Math.floor(Math.random() * 20),
                lastimage_timestamp: createNow()
            }));
        }
    },
};
