const Discord = require('discord.js');
const path = require('path');
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

    const loadDirectory = (directory) => {
        const items = fs.readdirSync(directory);
        console.log(items);
        const mods = items.map(i => {
            if ( fs.lstatSync(path.join(directory, i)).isDirectory() ) {
                return loadDirectory(path.join(directory, i));
            } else {
                return forceDefaults(require(path.join(directory, i)));
            }
        });

        return R.flatten(mods);
    };

    const mods = loadDirectory(__dirname + '/modules');



    // Here we load the modules from `./modules/`

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
                        message
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
