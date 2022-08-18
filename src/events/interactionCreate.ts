import { Interaction } from 'discord.js';
import { event } from '../types/events';
import Client from '../util/Client';
import { CONSTANTS } from '../util/config';

const interactionCreate: event<'interactionCreate'> = async (client: Client<true>, i: Interaction) =>
{
    // Drop the interaction if it is not a command
    if (!i.isChatInputCommand() || !i.isCommand() || !i.inCachedGuild()) return;

    client.logger.info(`Slash command '${i.commandName}' called by ${i.user.tag} (subcommand?: ${i.options.getSubcommand(false) || i.options.getSubcommandGroup(false) || 'none'})`);

    const command = client.commands.get(i.commandName);

    await i.deferReply();

    if (!command) return i.editReply(CONSTANTS.ERRORS.NOT_IMPLEMENTED_NOT_EXIST);

    return command.execute(i).catch(e =>
    {
        client.logger.error(e);
        console.log(e)
        i.editReply(CONSTANTS.ERRORS.COMMAND_RUN_ERROR)
    });

};

export default interactionCreate;
