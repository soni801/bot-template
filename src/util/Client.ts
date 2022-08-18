import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Client as DiscordClient, ClientOptions, Collection, EmbedBuilder, EmbedData } from 'discord.js';
import { readdir } from 'fs/promises';
import { basename, resolve } from 'node:path';
import { DataSource } from 'typeorm';
import ormconfig from '../../ormconfig';
import { Command } from '../types/Command';
import { event } from '../types/events';
import { CONSTANTS } from './config';
import Logger from './Logger';

/**
 * @author Soni & s1lv3r
 */
export default class Client<T extends boolean = boolean> extends DiscordClient<T>
{
    commands: Collection<string, Command> = new Collection();
    db = new DataSource(ormconfig);

    logger = new Logger(Client.name);
    rest = new REST({ version: '10' });

    constructor(options: ClientOptions)
    {
        super(options);

        this.on('error', e => console.log(e));

        this.connectDb().then(() => Promise.all([
            this.loadEvents('../events'),
            this.loadSlashCommands('../commands')
        ]));
    }

    async connectDb()
    {
        this.logger.verbose('Connecting to database');

        await this.db.initialize().catch((e: Error) =>
        {
            this.logger.error(`Failed to connect to the database: ${e.message}`);
            Promise.reject(e);
        });

        this.logger.info('Connected to the database');
    }

    async loadEvents(dir: string)
    {
        this.logger.verbose(`Loading events from ${dir}...`);

        let n = 0;

        const files = await readdir(resolve(__dirname, dir));
        this.logger.debug(`Found ${files.length} files`);

        for (const file of files)
        {
            const filePath = resolve(__dirname, dir, file);
            if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

            const event: event<any> = (await import(filePath)).default;
            const eventName = basename(file).split('.')[0];

            this.on(eventName as any, event.bind(null, this));

            n++;
            this.logger.debug(`Loaded event ${eventName}`);
        }

        this.logger.info(`Loaded ${n} events`);
    }

    async loadSlashCommands(dir: string)
    {
        this.logger.verbose(`Loading slash commands from ${dir}...`);

        const files = await readdir(resolve(__dirname, dir));
        this.logger.debug(`Found ${files.length} files.`);

        for (const file of files)
        {
            const filePath = resolve(__dirname, dir, file);

            if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

            // noinspection JSPotentiallyInvalidConstructorUsage
            const command: Command = new (await import(filePath)).default(this);

            this.commands.set(command.name, command);
            this.logger.debug(`Loaded slash command ${command.name}`);
        }

        this.logger.info(`Loaded ${this.commands.size} slash commands.`);
    }

    async deployCommands()
    {
        const body = [];

        for (const command of this.commands)
        {
            body.push((await command[1].slashCommand()).toJSON())
        }

        this.rest.put(Routes.applicationCommands((this as Client<true>).application.id), { body })
            .then(() => this.logger.info('Successfully registered application commands.'))
            .catch(console.error);
    }

    /**
     * Default embed
     * @param {EmbedData} [embed] Discord.js's Embed takes an embed as a param
     */
    defaultEmbed(embed?: EmbedData): EmbedBuilder {
        return new EmbedBuilder(embed)
            .setColor(CONSTANTS.COLORS.default)
            .setFooter({
                text: this.user?.tag ?? '',
                iconURL: this.user?.avatarURL({ extension: 'png' }) ?? '',
            });
    }
}
