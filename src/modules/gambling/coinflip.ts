import { selfDestroyMessage, simpleEmbed, simpleMessageEmbed } from "../../utility.js";

import * as R from "ramda";

import { stripIndents } from "common-tags";

import config from '../../config';

import * as mysql from 'mysql2/promise';

module.exports = <IMod> {
    name: 'coinflip',
    match: /^(coinflip|cf) (create|start|list)\ *(.+)*/gi,
    usage: 'coinflip <create/start/list>',
    nearmatch: /^(coinflip|cf)\ *(.+)*/gi,
    help: stripIndents`First, create a coinflip game, by using \`${config['prefix']}coinflip create heads/tails <bet>\`.
                       Then, have someone play against you, by using \`${config['prefix']}coinflip start <id>\`
                       That's it! Good luck!`,
    description: "A fun coin flipping game",
    run: async ({message, matches, connection, bot}) => {
        const [ _, command, option, rawArgs ] = matches.map( s => s ? s.toLowerCase() : s );

        if ( option === 'create' ) {
            const args = rawArgs.split(" ");

            if (!R.contains(R.toLower(args[0]))(["heads", "tails"])) {
                return selfDestroyMessage(message, {embed: simpleMessageEmbed(`Please select one of the following: \`heads\`, \`tails\``)});
            }

            // TODO: Set limit to 3 per user per guild

            // cast to numeric string e.g. '0' or '1'
            const isHeads = args[0] === "heads" ? '1' : '0';
            const bet = parseInt(args[1], 10);
            const [[user]] = <any> await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);

            if (bet < 0) {
                return selfDestroyMessage(message, {embed: simpleMessageEmbed(`You can not bet a negative amount.`)});
            }

            if ( user.balance < bet ) {
                return selfDestroyMessage(message, {embed: simpleMessageEmbed(`You don't have enough money to bet ${config['currencySymbol']} __${bet}__.`)});
            } else {
                await connection.execute("UPDATE users SET balance = ? WHERE id = ?", [
                    user.balance - bet,
                    user.id,
                ]);

                console.log(isHeads);

                const res = await connection.execute("INSERT INTO coinflips (userID, guildID, bet, isHeads, created_timestamp) VALUES (?, ?, ?, ?, ?)", [
                    user.id,
                    message.guild.id,
                    bet,
                    isHeads,
                    new Date(),
                ]);

                const rows = res[0];
                console.log(res[0]);

                const embed = simpleEmbed('Coinflip')
                    .addField("ID", `${rows['insertId']}`)
                    .addField("Stakes", `${config['currencySymbol']} __${bet}__`)
                    .addField("Success!", "A coinflip has just been created!")
                    .addField("Instructions", `To play against ${message.author.username}, type \`${config['prefix']}coinflip start ${rows['insertId']}\``);

                return message.channel.send({embed});
            }
        } else if ( option === 'start' ) {
            const args = rawArgs.split(" ");

            const id = args[0];

            if (/[0-9]+/gi.test(id)) {
                const [[game]] = <any> await connection.execute('SELECT * FROM coinflips WHERE gameID = ?', [args[0]]);

                const [[user]] = <any> await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);

                if ( game ) {
                    if ( user.id === game.userID ) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`You can't bet against yourself!`)});
                    if ( user.balance < game.bet ) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`It would seem that you can not afford that game... The bet is for ${config['currencySymbol']} ${game.bet}.`)});

                    if ( Math.random() > 0.5 ) {
                        // current user wins..
                        await connection.execute("UPDATE users SET balance = balance + ? WHERE id = ?", [game.bet, user.id]);

                        const embed = simpleEmbed()
                            .setTitle("WINNERRRR")
                            .addField("The winner is.....", `**${message.author.username}** for ${config['currencySymbol']} __${game.bet}__`);

                        message.channel.send({embed});

                        await connection.execute(`DELETE FROM coinflips WHERE gameID = ?`, [args[0]]);
                    } else {
                        // original better wins

                        // subtract from current user
                        await connection.execute("UPDATE users SET balance = balance - ? WHERE id = ?", [game.bet, user.id]);
                        await connection.execute("UPDATE users SET balance = balance + ? WHERE id = ?", [game.bet * 2, game.userID]);
                        // add to original better

                        const embed = simpleEmbed()
                            .setTitle("WINNERRRR")
                            .addField("The winner is.....", `**${bot.users.get(game.userID).username}** for ${config['currencySymbol']} __${game.bet}__`);

                        message.channel.send({embed});

                        await connection.execute(`DELETE FROM coinflips WHERE gameID = ?`, [args[0]]);
                    }
                } else {
                    return selfDestroyMessage(message, {embed: simpleMessageEmbed(`It would seem that we can't find that game.`)});
                }

            } else {
                return selfDestroyMessage(message, {embed: simpleMessageEmbed(`Please enter a valid id`)});
            }
        } else if ( option === 'list' ) {
            const [rows] = <any> await connection.execute(`SELECT * FROM coinflips WHERE guildID = ?`, [message.guild.id]);
            const embed = simpleEmbed('Coinflip');

            if ( rows.length === 0 ) embed.addField("There are no bets available!", "\u200B");
            else embed.addField("Info", "The following bets are available");

            rows.forEach( row => {
                embed.addField(`${bot.users.get(row.userID).username} for ${config['currencySymbol']}__${row.bet}__`, `\`${config['prefix']}coinflip start ${row.gameID}\``);
            });

            message.channel.send({embed});
        } else {
            selfDestroyMessage(message, {embed: simpleMessageEmbed(`Something went wrong ?_?`)});
        }
    },
};
