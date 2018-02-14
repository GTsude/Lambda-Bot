import * as moment from 'moment';

module.exports = {
    name: 'reward-activity',
    isCommand: false,
    permissionLevel: 1000,
    onMessage: async ({message, connection}) => {
        const [[user]] = await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);

        const then = moment(user.lastmessage_timestamp);
        const now = moment();

        // Calculate if the last message was longer than a minute ago
        if ( now.valueOf() - then.valueOf() > 60 * 1000 ) {
            await connection.execute("UPDATE users SET balance = ?, experience = ?, lastmessage_timestamp = ? WHERE id = ?", [
                user.balance + 1,
                user.experience + Math.floor(Math.random() * 500 + 100),
                new Date(),
                user.id,
            ]);
        }
    },
};
