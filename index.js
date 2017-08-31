const Discord = require('discord.js');
const auth = require('./config.json');
const {
    prefix
} = auth;

const R = require('ramda');
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


const main = async () => {
    const bot = new Discord.Client();

    // Here we load the modules from `./modules/`
    const items = fs.readdirSync(__dirname + '/modules');
    const mods = items.map(i => forceDefaults(require(`./modules/${i}`)));

    const connection = await createConnection(auth);


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
        try {
            console.log(`${message.author.username}: ${message.content}`);

            const [[user]] = await connection.execute("SELECT * FROM users WHERE id = ?", [message.author.id]);

            const then = moment(user.lastmessage_timestamp);
            const now = moment();

            // Calculate if the last message was longer than a minute ago
            if ( now - then > 60 * 1000 ) {
                await connection.execute("UPDATE users SET balance = ?, experience = ?, lastmessage_timestamp = ? WHERE id = ?", [
                    user.balance + 1,
                    user.experience + Math.floor(Math.random() * 500 + 100),
                    new Date(),
                    user.id
                ]);
            }

            // We merge universal variables with some local variables and pass them so they can be used in the bot.
            // this checks for command hits too, so it uses the `match` prop of a module and runs the `run` prop
            mods.map(mod => handleMessage(R.merge(universals, {
                mod,
                message
            })));

            // Raw message handler i.e. onMessage
            mods.map(mod => {
                try {
                    handleEvent("message", R.merge(universals, {
                        mod,
                        message,
                        user
                    }));
                } catch (e) {
                    console.error(e);
                }
            });
        } catch (e) {
            console.error(e);
        }
    });

    bot.on("messageReactionAdd", (messageReaction, user) => {
        // NOTE: This event will not run on old messages, only on ones the bot has seen, potential TODO
        mods.map(mod => handleEvent("messageReactionAdd", R.merge(universals, {
            mod,
            messageReaction,
            user
        })));
    });

    // TODO List
    // Add user specific purge


    bot.login(auth.token);
};

main();
