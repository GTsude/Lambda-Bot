import * as Discord from 'discord.js';
import * as mysql from 'mysql2/promise';

declare module "*.json" {
    const value: any;
    export default value;
}

declare interface IMod {
    permissionLevel?: number;
    prefix?: boolean;
    help?: string;
    usage?: string;
    isCommand?: boolean;
    description?: string;
    onLoad?: any;
    onMessageReactionAdd?: any;
    onMessage?: (params: {
        message: Discord.Message,
        connection: mysql.Connection,
        Discord,
        bot: Discord.Client,
        mods: Array<IMod>,
        mod: IMod,
    }) => void;
    run?: (params: {
        message: Discord.Message,
        connection: mysql.Connection,
        Discord,
        bot: Discord.Client,
        mods: Array<IMod>,
        mod: IMod,
        matches: RegExpMatchArray,
    }) => void;
    name: string;
}

declare type RGB = [number, number, number];

declare interface IConfig {
    token: string;
    mysqlUsername: string;
    mysqlPassword: string;
    mysqlDatabase?: string;
    prefix: string;
    owner: string;
    masters: Array<string>;
    botName: string;
    currencySymbol: string;
    osuAPIKey: string;
    embedColor: [number, number, number];
}
