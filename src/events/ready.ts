import { event } from '../types/events';
import Client from '../util/Client';

const ready: event<'ready'> = async (client: Client<true>) =>
{
    client.rest.setToken(client.token)

    await client.deployCommands().catch((e) =>
    {
        client.logger.error("it died");
        console.log(e);
        throw e;
    });

    client.logger.info('====================');
    client.logger.info(`Guilds: ${client.guilds.cache.size}`);
    client.logger.info(`Commands: ${client.commands.size}`);
    client.logger.info('====================');

    client.logger.warn(`Logged in as ${client.user?.tag}!`);
};

export default ready;
