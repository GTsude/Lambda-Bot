import * as moment from 'moment';

import { simpleMessageEmbed } from '../../utility';

module.exports = <IMod> {
    name: 'reminderticker',
    isCommand: false,
    onLoad: async ({bot, connection}) => {
        setInterval(async () => {
            const [reminders] = <any> await connection.execute("SELECT * FROM reminders");
            
            reminders.filter(reminder => moment(reminder.date).isBefore(moment())).forEach(async reminder => {
                await connection.execute("DELETE FROM reminders WHERE id = ?", [reminder.id]);
                bot.users.get(reminder.userID).send(simpleMessageEmbed(`${moment(reminder.created_timestamp).fromNow()} you asked me to remind you to '${reminder.description}'!`));
            });
        }, 10000);
    },
};
