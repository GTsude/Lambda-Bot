import * as Discord from 'discord.js';
import * as path from 'path';
import config from './config';

import * as R from 'ramda';
import * as moment from 'moment';
import * as mysql from 'mysql2/promise';

const createConnection = (authentication) => mysql.createConnection({
    host: authentication.mysqlHostName || 'localhost',
    user: authentication.mysqlUsername,
    password: authentication.mysqlPassword,
    database: authentication.mysqlDatabase || 'lambda',
});

import { handleMessage, handleEvent, forceDefaults } from './modules.js';

import * as fs from 'fs';

const main = async () => {
    const bot = new Discord.Client();

    // Load modules from a directory, recursively.
    const loadDirectory = (directory: string): Array<IMod> => {
        const items = fs.readdirSync(directory);
        const mods = items.map(i => {
            if (fs.lstatSync(path.join(directory, i)).isDirectory()) {
                return loadDirectory(path.join(directory, i));
            } else {
                if ( i.endsWith(".js") ) {
                    console.log("Loading " + i);
                    return forceDefaults(require(path.join(directory, i)));
                }
            }
        });

        // We need to flatten this, because it's a tree, and not an array.
        return R.flatten(mods).filter( m => m );
    };

    const mods = loadDirectory(__dirname + '/modules');

    // Here we load the modules from `./modules/`

    const connection = await createConnection(config);

    // Some global variables.
    const universals = {
        connection,
        mods,
        Discord,
        bot,
    };

    bot.on('ready', () => {
        console.log("Bot is ready");

        mods.map(mod => handleEvent("load", R.merge(universals, { mod })));
    });

    bot.on('message', async message => {
        try {
            console.log(`${message.author.username}: ${message.content}`);

            // Raw message handler i.e. onMessage
            mods.map(mod => {
                try {
                    handleEvent("message", R.merge(universals, {
                        mod,
                        message,
                    }));
                } catch (e) {
                    console.error(e);
                }
            });

            // We merge universal variables with some local variables and pass them so they can be used in the bot.
            // this checks for command hits too, so it uses the `match` prop of a module and runs the `run` prop
            mods.map(mod => handleMessage(R.merge(universals, {
                mod,
                message,
            })));
        } catch (e) {
            console.error(e);
        }
    });

    bot.on("messageReactionAdd", (messageReaction, user) => {
        // NOTE: This event will not run on old messages, only on ones the bot has seen, potential TODO
        mods.map(mod => handleEvent("messageReactionAdd", R.merge(universals, {
            mod,
            messageReaction,
            user,
        })));
    });

    bot.login(config.token);
};

main();
