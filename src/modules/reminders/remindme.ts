import * as moment from 'moment';

import { simpleMessageEmbed } from '../../utility';

module.exports = <IMod> {
    name: 'remindme',
    match: /^remind me in ([0-9]+) ([A-z]+) to (.+)$/gi,
    usage: 'remind me in <amount> <minutes/hours/days> to <message to leave>',
    nearmatch: /^remind\ ?me/gi,
    run: async ({message, matches, connection}) => {
        const [ , amount, unit, description] = matches;

        const time = moment().add(<any> parseInt(amount, 10), unit);

        await connection.execute("INSERT INTO reminders (date, created_timestamp, userID, description) VALUES (?, ?, ?, ?)", [time.toDate(), new Date(),  message.author.id, description]);

        message.channel.send({embed: simpleMessageEmbed(`I will remind you to '${description}' ${time.fromNow()}!`)});
    },
};
