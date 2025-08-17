import { CommandInteraction } from "discord.js";
import { MappingModel } from "../models/Mapping";

export default async function allowBots(interaction: CommandInteraction) {
    const mapping = await MappingModel.findOne({
        where: {
            discordChannel: interaction.channelId,
        },
    });

    if (!mapping) {
        interaction.reply("This channel is not connected to any Revolt channels.");
        return;
    }

    mapping.allowBots = !mapping.allowBots;
    await mapping.save();

    interaction.reply(`Successfully ${mapping.allowBots ? "enabled" : "disabled"} bot messages in this channel.`);
}
