/**
 * @author s1lv3r
 */
import {
    ApplicationCommand,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import Client from '../util/Client';
import Logger from '../util/Logger';

export abstract class Command
{
    /**
     * The client that this interaction is attached to
     *
     * @type {Client}
     * @memberof Interaction
     */
    client: Client;

    /**
     * The logger for this interaction
     *
     * @type {Logger}
     * @memberof Interaction
     */
    logger: Logger;

    /**
     * Name of the interaction
     *
     * @type {string}
     * @memberof Interaction
     */
    name: string;

    constructor(client: Client);

    /**
     * The slash command builder for this interaction.
     *
     * @abstract
     * @return {(Promise<
     *     | SlashCommandBuilder
     *     | SlashCommandSubcommandsOnlyBuilder
     *     | SlashCommandSubcommandGroupBuilder
     *   >)}
     * @memberof Interaction
     */
    abstract slashCommand(): Promise<
        | SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | SlashCommandSubcommandGroupBuilder
        >;

    /**
     * The entry point for this interaction.
     *
     * @abstract
     * @param {ApplicationCommand} i The interaction object.
     * @return {Promise<void>} Is an async function.
     * @memberof Interaction
     */
    abstract execute(i: ChatInputCommandInteraction<'cached'>): Promise<any>;
}
