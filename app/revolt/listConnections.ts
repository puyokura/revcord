import { UniversalMessage } from "../interfaces";
import { MappingModel } from "../models/Mapping";

export default async function listConnections(message: UniversalMessage) {
    const mappings = await MappingModel.findAll({
        where: {
            revoltChannel: message.channelId,
        },
    });

    if (mappings.length === 0) {
        message.reply("This channel is not connected to any Discord channels.");
        return;
    }

    const channels = mappings.map((mapping) => mapping.discordChannelName);

    message.reply(`This channel is connected to: ${channels.join(", ")}`);
}
