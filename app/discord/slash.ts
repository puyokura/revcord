import { CommandInteraction } from "discord.js";
import { Command } from "../interfaces";
import universalExecutor from "../universalExecutor";
import commands from "./commands";

export default async function slash(interaction: CommandInteraction) {
    const command = interaction.commandName;
    const args = interaction.options.data.map((option) => option.value.toString());

    universalExecutor(
        {
            command,
            args,
            author: interaction.user,
            channel: interaction.channel,
            channelId: interaction.channelId,
            reply: (msg) => interaction.reply(msg),
        },
        commands
    );
}
