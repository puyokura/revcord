import { APIEmbed, Attachment, Embed, EmbedBuilder } from "discord.js";
import { Message } from "revolt.js";

export function buildDiscordEmbed(message: Message) {
  const author = message.author;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: author.username,
      iconURL: author.generateAvatarURL({ size: 64 }),
    })
    .setColor("#ff4654");

  if (message.content)
    embed.setDescription(message.content.toString().substring(0, 4096));

  return embed;
}
