import Client from './util/Client';
import { CLIENT_OPTIONS, token } from './util/config';

let client: Client;

function start()
{
    client = new Client(CLIENT_OPTIONS);
    client.login(token).then(() => {});

    client.on('restart', async () =>
    {
        client.logger.info('Restarting...');
        client.destroy();
        start();
    });
}

start();

function exit(...arg: string[]) {
    client.logger.warn(`${arg} received, exiting...`);
    client.destroy();
    client.db.destroy().catch(() => {});
}

process.on('SIGTERM', exit);
process.on('SIGQUIT', exit);
process.on('SIGINT', exit);
process.on('exit', exit);
