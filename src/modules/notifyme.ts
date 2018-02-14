import * as Discord from 'discord.js';

import { selfDestroyMessage } from "../utility";

module.exports = {
    name: 'notifyme',
    permissionLevel: 1000,
    onMessage: ({message, user}) => {
        if ( message.channel.id === '348868496811098122' ) {
            if ( message.author.id === '169979689518104576' ) {
                selfDestroyMessage(message, "<@119782414175305728>", 1);
                selfDestroyMessage(message, "<@345225575104774144>", 1);
            } else if (  message.author.id === '119782414175305728' || message.author.id === '345225575104774144' ) {
                selfDestroyMessage(message, "<@169979689518104576>", 1);
            }
        }
    },
};
