import { UniversalMessage } from "../interfaces";
import { MappingModel } from "../models/Mapping";

export default async function connect(message: UniversalMessage) {
    const discordChannel = message.args[0];

    if (!discordChannel) {
        message.reply("Please specify a Discord channel to connect to.");
        return;
    }

    try {
        await MappingModel.create({
            discordChannel,
            revoltChannel: message.channelId,
            discordChannelName: discordChannel, // TODO: get channel name
            revoltChannelName: message.channel.name,
        });

        message.reply("Successfully connected this channel.");
    } catch (e) {
        message.reply(`An error occurred: ${e.message}`);
    }
}
