import { CommandInteraction } from "discord.js";
import { MappingModel } from "../models/Mapping";

export default async function listConnections(interaction: CommandInteraction) {
    const mappings = await MappingModel.findAll({
        where: {
            discordChannel: interaction.channelId,
        },
    });

    if (mappings.length === 0) {
        interaction.reply("This channel is not connected to any Revolt channels.");
        return;
    }

    const channels = mappings.map((mapping) => mapping.revoltChannelName);

    interaction.reply(`This channel is connected to: ${channels.join(", ")}`);
}
