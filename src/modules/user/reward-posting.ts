import * as moment from "moment";

module.exports = <IMod> {
    name: 'rewards',
    help: 'You get rewarded for posting stuff!',
    usage: 'Yeah, you just uh... upload st uff, no commands or anything',
    isCommand: false,
    onMessage: async ({connection, message}) => {
        if ( message.attachments.size >= 1 && message.guild.memberCount >= 5 ) {
            const [[user]] = <any> await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);

            const now = moment();
            const then = moment(user.lastimage_timestamp);

            // Calculate if last image was <1 minute ago.
            if ( now.valueOf() - then.valueOf() < 60 * 1000 ) return;

            await connection.execute("UPDATE users SET balance = ?, experience = ?, lastimage_timestamp = ? WHERE id = ?", [
                user.balance + 5,
                user.experience + Math.floor(Math.random() * 20),
                new Date(),
                user.id,
            ]);
        }
    },
};
