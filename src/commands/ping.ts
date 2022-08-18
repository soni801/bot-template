import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types/Command';
import type Client from '../util/Client';
import Logger from '../util/Logger';

export default class Ping implements Command
{
    name = 'ping';
    description = 'Ping pong bitch'
    client: Client;
    logger = new Logger(Ping.name);

    constructor(client: Client)
    {
        this.client = client
    }

    async execute(i: ChatInputCommandInteraction<'cached'>)
    {
        // Send a message
        await i.editReply(":ping_pong:Testing ping");

        // Fetch the message, and check the latency
        const message = await i.fetchReply();

        await i.editReply(`:ping_pong: Pong!Soni Bot latency (RTT): ${message.createdTimestamp - i.createdTimestamp}msAPI latency: ${Math.round(this.client.ws.ping)}ms`);
    }

    async slashCommand()
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);
    }
}
