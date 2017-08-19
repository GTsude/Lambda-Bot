const R = require('ramda');

const {
    prefix,
    masters
} = require("./config.json");

const { selfDestroyMessage } = require("./utility.js");

const { stripIndents } = require("common-tags");

// TODO: Relocate and reimplement
const calculatePermissionLevel = message => R.contains(message.author.id)(masters) ? 1000 : 0;

const handleEvent = (event, params) => {
    const {mod} = params;

    // Capitalize first character
    const evtName = event[0].toUpperCase() + event.substring(1);

    // run event handler (e.g. onMessage)
    mod['on' + evtName] ? mod['on' + evtName](params) : 0;
};

const handleMessage = (params) => {
    const {
        connection,
        mod,
        message,
        bot
    } = params;

    if ( ! mod.run || ! mod.match) return; // It needs to have a `run` method and a `match` prop
    if ( message.author === bot.user ) return; // Can't be itself

    const sub = createSub(message);
    const isPrefixed = message.content.startsWith(prefix);

    // RegExp matches
    const matches = mod.match.exec(sub);

    // Check prefix
    if (isPrefixed) {
        if (matches && (!mod.channel || mod.channel.test(message.channel.type))) {
            // Too low permission level
            if (mod.permissionLevel > calculatePermissionLevel(message) ) {
                return selfDestroyMessage(message, "Oh noes! It looks like you do not have permission to use this command!").catch(console.error);
            } else {
                // Provide matches too
                mod.run(R.merge(params, {
                    matches
                }));
            }
        }
        // Usage example
        else if (mod.nearmatch && mod.nearmatch.exec(sub)) {
            selfDestroyMessage(message, `The correct usage is \`${mod.usage}\``).catch(console.error);
        }
    }
};

const forceDefaults = mod => R.merge({
    permissionLevel: 0
}, mod);

const createSub = message => message.content.substring(prefix.length);
const createArgs = message => createSub(message).split(" ");
const findModule = (mods, test) =>
    mods.filter(mod => mod.name === test)[0];

module.exports = {
    createSub,
    createArgs,
    findModule,
    handleMessage,
    handleEvent,
    calculatePermissionLevel,
    forceDefaults
};
