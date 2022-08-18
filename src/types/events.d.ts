import type { Awaitable, ClientEvents } from 'discord.js';
import Client from '../util/Client';

export type event<K extends keyof ClientEvents> = (client: Client, ...arg: ClientEvents[K]) => Awaitable<any>;
