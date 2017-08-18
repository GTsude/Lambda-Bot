const Discord = require('discord.js');
const auth = require('./config.json');
const {
    prefix
} = auth;
const R = require('ramda');
const mysql = require('mysql');
const moment = require('moment');

const {
    getUser,
    createUpdateQuery,
    logMessage,
    createConnection,
    createNow
} = require('./database.js');

const {
    createCommand,
    runCommand
} = require('./commands.js');

const fs = require("fs");

const connection = createConnection(auth);

const bot = new Discord.Client();

const items = fs.readdirSync(__dirname + '/commands');
const commands = items.map(i => require(`./commands/${i}`));

bot.on('ready', () => {
    console.log("Bot is ready");
});

bot.on('message', message => {
    console.log(`${message.author.username}: ${message.content}`);

    logMessage(connection, message);

    // TODO: change to async, and change to updateUser
    getUser(connection, message.author.id).then(user => {
        const then = moment(user.lastmessage_timestamp);
        const now = moment();

        const next = (now - then > 60 * 1000) ? {
            balance: user.balance + 1,
            experience: user.experience + Math.floor(Math.random() * 500 + 100)
        } : {};

        const q = createUpdateQuery('users', R.merge({
            lastmessage_timestamp: createNow()
        }, next), `id = ${user.id}`);
        connection.query(q);

        commands.map(command => runCommand({
            connection,
            command,
            message,
            commands,
            bot
        }));
    }).catch(e => reportError(bot, message, e));
});

connection.connect(err => {
    if (err) console.error("Error connecting to DB:", err.stack);
    else console.log("Successfully connected to DB");
    return bot.login(auth.token);
});
