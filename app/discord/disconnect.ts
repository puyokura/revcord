import { CommandInteraction } from "discord.js";
import { MappingModel } from "../models/Mapping";

export default async function disconnect(interaction: CommandInteraction) {
    try {
        await MappingModel.destroy({
            where: {
                discordChannel: interaction.channelId,
            },
        });

        interaction.reply("Successfully disconnected this channel.");
    } catch (e) {
        interaction.reply(`An error occurred: ${e.message}`);
    }
}
