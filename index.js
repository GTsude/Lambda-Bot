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
    handleMessage,
    handleEvent,
    forceDefaults
} = require('./modules.js');

const fs = require("fs");

const connection = createConnection(auth);

const bot = new Discord.Client();

// Here we load the modules from `./modules/`
const items = fs.readdirSync(__dirname + '/modules');
const mods = items.map(i => forceDefaults(require(`./modules/${i}`)));

// Some global variables.
const universals = {
    connection,
    mods,
    Discord,
    bot
};

bot.on('ready', () => {
    console.log("Bot is ready");
});

bot.on('message', async message => {
    console.log(`${message.author.username}: ${message.content}`);

    const user = await getUser(connection, message.author.id);

    const then = moment(user.lastmessage_timestamp);
    const now = moment();

    updateUser(connection, user.id, () => R.merge({
        lastmessage_timestamp: createNow()
    }, (now - then > 60 * 1000) ? {
        balance: user.balance + 1,
        experience: user.experience + Math.floor(Math.random() * 500 + 100)
    } : {}));

    // We merge universal variables with some local variables and pass them so they can be used in the bot.
    mods.map(mod => handleMessage(R.merge(universals, {
        mod,
        message
    })));

    mods.map(mod => handleEvent("message", R.merge(universals, {
        mod,
        message,
        user
    })));
});

bot.on("messageReactionAdd", (messageReaction, user) => {
    // NOTE: This event will not run on old messages, only on ones the bot has seen, potential TODO
    mods.map(mod => handleEvent("messageReactionAdd", R.merge(universals, {
        mod,
        messageReaction,
        user
    })));
});

connection.connect(err => {
    if (err) console.error("Error connecting to DB:", err.stack);
    else console.log("Successfully connected to DB");
    return bot.login(auth.token);
});

// TODO List
// Add user specific purge
