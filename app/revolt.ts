import { Client } from "revolt.js";
import { Main } from "./Main";
import { DISCORD_EMOJI_REGEX } from "./util/regex";
import { buildDiscordEmbed } from "./util/embeds";
import { Message } from "revolt.js";
import { Webhook } from "discord.js";
import { Attachment } from "revolt.js/dist/maps/Attachments";
import truncate from "./util/truncate";
import universalExecutor from "./universalExecutor";
import commands from "./revolt/commands";

export class RevoltBot {
  private client: Client;
  private readonly token: string;

  constructor(token: string) {
    this.client = new Client();
    this.token = token;

    this.client.on("ready", () => {
      console.info("Logged in as " + this.client.user.username);
    });

    this.client.on("message", this.onMessage.bind(this));
    this.client.on("message/update", this.onMessageUpdate.bind(this));
    this.client.on("message/delete", this.onMessageDelete.bind(this));
  }

  async onMessage(message: Message) {
    if (message.author.bot) return;

    // Commands
    if (message.content.startsWith("rc!")) {
      const [command, ...args] = message.content.substring(3).split(" ");
      universalExecutor(
        {
          command,
          args,
          author: message.author,
          channel: message.channel,
          channelId: message.channel_id,
          reply: (msg) => message.reply(msg, false),
        },
        commands
      );
      return;
    }

    const mappings = Main.mappings.filter(
      (mapping) => mapping.revolt === message.channel_id
    );

    if (mappings.length === 0) return;

    const webhooks = mappings.map(
      (mapping) =>
        Main.webhooks.find((webhook) => webhook.id === mapping.discord) // TODO: this is wrong
    );

    const embed = buildDiscordEmbed(message);

    const files = this.buildAttachments(message.attachments);

    for (const webhook of webhooks) {
      try {
        const sentMessage = await webhook.send({
          embeds: [embed],
          files,
        });

        Main.revoltCache.push({
          revoltId: message._id,
          discordId: sentMessage.id,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  async onMessageUpdate(message: Message) {
    const discordMessage = Main.revoltCache.find(
      (msg) => msg.revoltId === message._id
    )?.discordId;

    if (!discordMessage) return;

    const mappings = Main.mappings.filter(
      (mapping) => mapping.revolt === message.channel_id
    );

    if (mappings.length === 0) return;

    const webhooks = mappings.map(
      (mapping) =>
        Main.webhooks.find((webhook) => webhook.id === mapping.discord) // TODO: this is wrong
    );

    const embed = buildDiscordEmbed(message);

    for (const webhook of webhooks) {
      try {
        await webhook.editMessage(discordMessage, {
          embeds: [embed],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  async onMessageDelete(id: string) {
    const discordMessage = Main.revoltCache.find(
      (msg) => msg.revoltId === id
    )?.discordId;

    if (!discordMessage) return;

    const mappings = Main.mappings;

    if (mappings.length === 0) return;

    const webhooks = mappings.map(
      (mapping) =>
        Main.webhooks.find((webhook) => webhook.id === mapping.discord) // TODO: this is wrong
    );

    for (const webhook of webhooks) {
      try {
        await webhook.deleteMessage(discordMessage);
      } catch (e) {
        console.error(e);
      }
    }
  }

  login() {
    this.client.loginBot(this.token);
  }

  private buildAttachments(attachments: Attachment[]) {
    if (!attachments) return [];

    const attachmentUrl = process.env.REVOLT_ATTACHMENT_URL;

    return attachments.map((attachment) => {
      return {
        attachment: `${attachmentUrl}/${attachment.tag}/${attachment._id}`,
        name: attachment.filename,
      };
    });
  }
}
