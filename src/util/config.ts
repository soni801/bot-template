import { GatewayIntentBits } from 'discord-api-types/v10';
import { ClientOptions, ColorResolvable, User } from 'discord.js';
import './dotenv';

export const token = process.env.TOKEN;

const COLORS: { [ key: string ]: ColorResolvable } = {
    default: 'Blurple',
    success: 'Green',
    warning: 'Orange',
    error: 'Red'
};

export const CONSTANTS = {
    ERRORS: {
        GENERIC: 'An error has occurred.',
        DEPLOY_FAILED: 'Failed to deploy!',
        CLIENT_DESTROY: 'Client destroyed, exiting process...',
        SHUTDOWN_USED: (user: User) => `Shutdown command used by ${user.tag} on ${new Date()}`,
        COMMAND_RUN_ERROR: 'An error occurred while running the command, please try again later or contact the bot owner if the problem persists.',
        DISABLED: ':lock: This command has been disabled.',
        BOT_MISSING_PERMS: ':x: The command could not be preformed because one or more permissions are missing.',
        USER_MISSING_PERMS: ':lock: You do not have permission to use this command.',
        DB_NOT_CONNECTED: ':x: Database not connected, try again later.',
        UNKNOWN_SUBCOMMAND: ':x: Unknown subcommand.',
        NOT_IMPLEMENTED_NOT_EXIST: ':x: Not implemented or doesn\'t exist'
    },
    COLORS,
    logLevel: process.env.LOG_LEVEL || 'debug'
};

export const CLIENT_OPTIONS: ClientOptions = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
    allowedMentions: {
        parse: [ 'users', 'roles' ]
    }
}
