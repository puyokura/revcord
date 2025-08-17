import { UniversalMessage } from "../interfaces";
import { MappingModel } from "../models/Mapping";

export default async function allowBots(message: UniversalMessage) {
    const mapping = await MappingModel.findOne({
        where: {
            revoltChannel: message.channelId,
        },
    });

    if (!mapping) {
        message.reply("This channel is not connected to any Discord channels.");
        return;
    }

    mapping.allowBots = !mapping.allowBots;
    await mapping.save();

    message.reply(`Successfully ${mapping.allowBots ? "enabled" : "disabled"} bot messages in this channel.`);
}
