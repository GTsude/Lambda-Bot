const { getUser, updateUser, createInsertQuery, createSelectQuery, createNow, createDeleteQuery } = require("../database.js");
const { selfDestroyMessage, simpleEmbed, simpleMessageEmbed } = require("../utility.js");
const R = require("ramda");

const { stripIndents } = require("common-tags");

const {
    prefix,
    currencySymbol,
    botName
} = require('../config.json');

module.exports = {
    name: 'coinflip',
    match: /^(coinflip|cf) (create|start|list)\ *(.+)*/gi,
    usage: 'coinflip <create/start/list>',
    nearmatch: /^(coinflip|cf)\ *(.+)*/gi,
    help: stripIndents`First, create a coinflip game, by using \`${prefix}coinflip create heads/tails <bet>\`.
                       Then, have someone play against you, by using \`${prefix}coinflip start <id>\`
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
            const isHeads = new String(new Number(args[0] === "heads"));
            const bet = parseInt(args[1], 10);
            const user = await getUser(connection, message.author.id);

            if (bet < 0) {
                return selfDestroyMessage(message, {embed: simpleMessageEmbed(`You can not bet a negative amount.`)});
            }

            if ( user.balance < bet ) {
                return selfDestroyMessage(message, {embed: simpleMessageEmbed(`You don't have enough money to bet ${currencySymbol} __${bet}__.`)});
            } else {
                await updateUser(connection, user.id, $ => ({
                    balance: $.balance - bet
                }));

                const now = createNow();
                connection.query(createInsertQuery('coinflips', {
                    userID: user.id,
                    guildID: message.guild.id,
                    bet,
                    isHeads,
                    created_timestamp: now
                }), (err, rows) => {
                    if ( err ) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`Something went wrong! \`${err}\``)});
                    const embed = simpleEmbed()
                        .setTitle(`${botName} - Coinflip`)
                        .addField("ID", `${rows.insertId}`)
                        .addField("Stakes", `${currencySymbol} __${bet}__`)
                        .addField("Success!", "A coinflip has just been created!")
                        .addField("Instructions", `To play against ${message.author.username}, type \`${prefix}coinflip start ${rows.insertId}\``);

                    return message.channel.send({embed});
                });
            }
        } else if ( option === 'start' ) {
            const args = rawArgs.split(" ");

            const id = args[0];

            if (/[0-9]+/gi.test(id)) {
                const deleteQuery = createDeleteQuery('coinflips', `gameID = ${args[0]}`);

                const query = createSelectQuery('coinflips', `gameID = ${args[0]}`);

                connection.query(query, async (err, rows) => {
                    if ( err ) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`Something went wrong! \`${err}\``)});

                    const user = await getUser(connection, message.author.id);

                    const game = rows[0];

                    if ( game ) {
                        if ( user.id === game.userID ) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`You can't bet against yourself!`)});
                        if ( user.balance < game.bet ) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`It would seem that you can not afford that game... The bet is for ${game.bet}.`)});

                        if ( Math.random() > 0.5 ) {
                            // current user wins..
                            await updateUser(connection, user.id, $ => ({
                                balance: $.balance + game.bet
                            }));

                            const embed = simpleEmbed()
                                .setTitle("WINNERRRR")
                                .addField("The winner is.....", `**${message.author.username}** for ${currencySymbol} __${game.bet}__`);

                            message.channel.send({embed});

                            connection.query(deleteQuery);
                        } else {
                            // original better wins

                            // subtract from current user
                            await updateUser(connection, user.id, $ => ({
                                balance: $.balance - game.bet
                            }));

                            // add to original better
                            await updateUser(connection, game.userID, $ => ({
                                balance: $.balance + game.bet * 2
                            }));

                            const embed = simpleEmbed()
                                .setTitle("WINNERRRR")
                                .addField("The winner is.....", `**${bot.users.get(game.userID).username}** for ${currencySymbol} __${game.bet}__`);

                            message.channel.send({embed});

                            connection.query(deleteQuery);
                        }
                    } else {
                        return selfDestroyMessage(message, {embed: simpleMessageEmbed(`It would seem that we can't find that game.`)});
                    }
                });
            } else {
                return selfDestroyMessage(message, {embed: simpleMessageEmbed(`Please enter a valid id`)});
            }
        } else if ( option === 'list' ) {
            connection.query(createSelectQuery('coinflips', `guildID = '${message.guild.id}'`), (err, rows) => {
                if ( err ) return selfDestroyMessage(message, {embed: simpleMessageEmbed(`Something went wrong! \`${err}\``)});

                const embed = simpleEmbed()
                    .setTitle(`${botName} - Coinflip`);

                if ( rows.length === 0 ) embed.addField("There are no bets available!", "\u200B");
                else embed.addField("Info", "The following bets are available");

                rows.forEach( row => {
                    embed.addField(`${bot.users.get(row.userID).username} for ${currencySymbol} __${row.bet}__`, `\`${prefix}coinflip start ${row.gameID}\``);
                });


                message.channel.send({embed});
            });
        } else {
            selfDestroyMessage(message, {embed: simpleMessageEmbed(`Something went wrong ?_?`)});
        }
    }
};
