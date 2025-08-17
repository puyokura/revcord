import { UniversalMessage } from "../interfaces";
import { MappingModel } from "../models/Mapping";

export default async function disconnect(message: UniversalMessage) {
    try {
        await MappingModel.destroy({
            where: {
                revoltChannel: message.channelId,
            },
        });

        message.reply("Successfully disconnected this channel.");
    } catch (e) {
        message.reply(`An error occurred: ${e.message}`);
    }
}
