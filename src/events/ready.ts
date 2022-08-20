import { event } from '../types/events';
import Client from '../util/Client';

/**
 * The ready event
 *
 * @param {Client<true>} client The Client to use for the event
 * @returns {Promise<Client<true>>} The provided Client
 *
 * @author Soni
 * @since 1.0.0
 * @see {@link ClientEvents.ready}
 */
const ready: event<'ready'> = async (client: Client<true>) =>
{
    // Deploy the application's slash commands
    client.rest.setToken(client.token)
    await client.deployCommands().catch((e: Error) =>
    {
        client.logger.error(`An error occurred while deploying commands: ${e.message}`);
        throw e;
    });

    client.logger.verbose(`Loaded ${client.guilds.cache.size} guild(s)`);
    client.logger.verbose(`Loaded ${client.commands.size} command(s)`);
    client.logger.warn(`Logged in as ${client.user?.tag}!`);

    return client;
};

export default ready;
