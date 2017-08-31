const moment = require("moment");

module.exports = {
    name: 'rewards',
    help: 'You get rewarded for posting stuff!',
    usage: 'Yeah, you just uh... upload stuff, no commands or anything',
    onMessage: async ({connection, message}) => {
        if ( message.attachments.size >= 1 && message.guild.memberCount >= 5 ) {
            const [[user]] = await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);

            const now = moment();
            const then = moment(user.lastimage_timestamp);

            // Calculate if last image was <1 minute ago.
            if ( now - then < 60 * 1000 ) return;

            await connection.execute("UPDATE users SET balance = ?, experience = ?, lastimage_timestamp = ? WHERE id = ?", [
                user.balance + 5,
                user.experience + Math.floor(Math.random() * 20),
                new Date(),
                user.id
            ]);
        }
    },
};
