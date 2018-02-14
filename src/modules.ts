import * as R from 'ramda';
import * as Discord from 'discord.js';
import * as mysql from 'mysql2';

import config from './config';

import { selfDestroyMessage, simpleEmbed } from './utility';

import { stripIndents } from 'common-tags';

// TODO: Relocate and reimplement
export const calculatePermissionLevel = message => R.contains(message.author.id)((<any> config).masters) ? 1000 : 0;

export const handleEvent = (event, params): void => {

    if ( !(event && params && params.mod) ) return;

    const {
        mod,
    } = params;

    // Capitalize first character
    const evtName = event[0].toUpperCase() + event.substring(1);

    // run event handler (e.g. onMessage)
    const fn = mod['on' + evtName];

    if ( fn && mod ) {
        // console.log(mod.name, fn !== undefined, 'on' + evtName);
        fn(params);
    }
};

export const handleMessage = (params): void => {
    try {
        const {
            connection,
            mod,
            message,
            bot,
        } = params;

        if (!mod) return;

        if (!mod.run || !mod.match) return; // It needs to have a `run` method and a `match` prop
        if (message.author.id === bot.user.id) return; // Can't be itself

        const sub = createSub(message);
        const isPrefixed = message.content.startsWith(<any>config['prefix']);

        const matcher = new RegExp(mod.match);

        // RegExp matches
        const matches = matcher.exec(sub);

        // Check prefix
        if (isPrefixed || !mod.prefix) {
            if (matches && (!mod.channel || mod.channel.test(message.channel.type))) {
                // Too low permission level
                if (mod.permissionLevel > calculatePermissionLevel(message)) {
                    selfDestroyMessage(message, {
                        embed: simpleEmbed().addField('Oops!',
                        "Oh noes! It looks like you do not have permission to use this command!"),
                    }).catch(console.error);
                } else {
                    // Provide matches too
                    mod.run(R.merge(params, {
                        matches,
                    }));
                }
            } else if (mod.nearmatch && mod.nearmatch.exec(sub)) {
                selfDestroyMessage(message, { embed: simpleEmbed().addField('Usage', `The correct usage is \`${mod.usage}\``) }).catch(console.error);
            }
        }
    } catch (e) {
        throw e;
    }
};

export const forceDefaults = (mod): IMod => R.merge({
    permissionLevel: 0,
    prefix: true,
    help: 'No help provided',
    usage: '???',
    isCommand: true,
    description: 'No description provided',
}, mod);

export const createSub = (message: Discord.Message) => message.content.substring(config.prefix.length);

export const createArgs = (message: Discord.Message) => createSub(message).split(" ");
export const findModule = (mods: Array<IMod>, test: string): IMod =>
    mods.filter(mod => mod ? mod.name === test : false)[0];
