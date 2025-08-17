import { CommandInteraction } from "discord.js";
import { MappingModel } from "../models/Mapping";

export default async function connect(interaction: CommandInteraction) {
    const revoltChannel = interaction.options.get("channel").value.toString();

    try {
        await MappingModel.create({
            discordChannel: interaction.channelId,
            revoltChannel,
            discordChannelName: interaction.channel.name,
            revoltChannelName: revoltChannel, // TODO: get channel name
        });

        interaction.reply("Successfully connected this channel.");
    } catch (e) {
        interaction.reply(`An error occurred: ${e.message}`);
    }
}
