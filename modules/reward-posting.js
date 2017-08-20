const { getUser, updateUser } = require("../database.js");
const { selfDestroyMessage } = require("../utility.js");

module.exports = {
    name: 'rewards',
    help: 'You get rewarded for posting images!',
    usage: 'Yeah, you just uh... upload images',
    onMessage: async ({connection, message}) => {
        if ( message.attachments.size >= 1 && message.guild.memberCount >= 10 ) {
            const user = await getUser(connection, message.author.id);
            const now = moment();
            const then = moment(user.lastimage_timestamp);

            if ( now - then < 60 * 1000 ) return;

            updateUser(connection, message.author.id, $ => ({
                balance: $.balance + 5,
                experience: $.experience + Math.floor(Math.random() * 20)
            }));
        }
    },
};
