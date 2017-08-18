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
    createNow,
    updateUser
} = require('./database.js');

const {
    handleMessage
} = require('./modules.js');

const fs = require("fs");

const connection = createConnection(auth);

const bot = new Discord.Client();

const items = fs.readdirSync(__dirname + '/commands');
const commands = items.map(i => require(`./commands/${i}`));

bot.on('ready', () => {
    console.log("Bot is ready");
});

bot.on('message', async message => {
    console.log(`${message.author.username}: ${message.content}`);

    logMessage(connection, message);

    const user = await getUser(connection, message.author.id);

    const then = moment(user.lastmessage_timestamp);
    const now = moment();

    updateUser(connection, user.id, () => R.merge({
        lastmessage_timestamp: createNow()
    }, (now - then > 60 * 1000) ? {
        balance: user.balance + 1,
        experience: user.experience + Math.floor(Math.random() * 500 + 100)
    } : {}));

    commands.map(command => handleMessage({
        connection,
        command,
        message,
        commands,
        bot
    }));
});

connection.connect(err => {
    if (err) console.error("Error connecting to DB:", err.stack);
    else console.log("Successfully connected to DB");
    return bot.login(auth.token);
});


//
// TODO List
// Add user specific purge
