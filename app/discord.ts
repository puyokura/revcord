import {
  Client,
  GatewayIntentBits,
  Partials,
  Webhook,
  ChannelType,
  TextChannel,
  EmbedBuilder,
  Attachment,
  User,
  Message,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { Main } from "./Main";
import { REVOLT_EMOJI_REGEX } from "./util/regex";
import truncate from "./util/truncate";
import isElevated from "./util/permissions";
import slash from "./discord/slash";

export class DiscordBot {
  private client: Client;
  private readonly token: string;

  constructor(token: string) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Channel],
    });
    this.token = token;

    this.client.on("ready", this.onReady.bind(this));
    this.client.on("messageCreate", this.onMessage.bind(this));
    this.client.on("messageUpdate", this.onMessageUpdate.bind(this));
    this.client.on("messageDelete", this.onMessageDelete.bind(this));
    this.client.on("interactionCreate", this.onInteraction.bind(this));
  }

  async onReady() {
    console.info(`Logged in as ${this.client.user.tag}!`);

    // Register slash commands
    const commands = [
      new SlashCommandBuilder()
        .setName("connect")
        .setDescription("Connect a channel to a Revolt channel")
        .addStringOption((option) =>
          option
            .setName("channel")
            .setDescription("The Revolt channel ID to connect to")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect a channel from a Revolt channel"),
      new SlashCommandBuilder()
        .setName("connections")
        .setDescription("List all connections for this channel"),
      new SlashCommandBuilder()
        .setName("bots")
        .setDescription("Toggle bot messages in this channel"),
    ].map((command) => command.toJSON());

    const rest = new REST({ version: "10" }).setToken(this.token);

    try {
      await rest.put(Routes.applicationCommands(this.client.user.id), {
        body: commands,
      });
    } catch (error) {
      console.error(error);
    }

    // Get webhooks
    const mappings = Main.mappings;

    for (const mapping of mappings) {
      const channel = (await this.client.channels.fetch(
        mapping.discord
      )) as TextChannel;

      if (channel.type !== ChannelType.GuildText) continue;

      const webhooks = await channel.fetchWebhooks();
      let webhook = webhooks.find((webhook) => webhook.name === "RevCord");

      if (!webhook) {
        webhook = await channel.createWebhook({
          name: "RevCord",
          avatar: this.client.user.avatarURL(),
        });
      }

      Main.webhooks.push(webhook);
    }
  }

  async onMessage(message: Message) {
    if (message.author.bot && !Main.mappings.find(m => m.discord === message.channelId)?.allowBots) return;

    const revoltChannel = Main.mappings.find(
      (mapping) => mapping.discord === message.channelId
    )?.revolt;

    if (!revoltChannel) return;

    const revoltBot = Main.bots.revolt;
    const channel = await revoltBot.channels.fetch(revoltChannel);

    const embed = this.buildRevoltEmbed(message.author, message.content);

    const attachments = this.buildAttachments(message.attachments.values());

    try {
      const sentMessage = await channel.sendMessage({
        content: message.content,
        embeds: [embed],
        attachments,
      });

      Main.discordCache.push({
        discordId: message.id,
        revoltId: sentMessage._id,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async onMessageUpdate(oldMessage: Message, newMessage: Message) {
    const revoltMessage = Main.discordCache.find(
      (msg) => msg.discordId === oldMessage.id
    )?.revoltId;

    if (!revoltMessage) return;

    const revoltChannel = Main.mappings.find(
      (mapping) => mapping.discord === oldMessage.channelId
    )?.revolt;

    if (!revoltChannel) return;

    const revoltBot = Main.bots.revolt;
    const channel = await revoltBot.channels.fetch(revoltChannel);

    const embed = this.buildRevoltEmbed(newMessage.author, newMessage.content);

    try {
      await channel.messages.edit(revoltMessage, {
        embeds: [embed],
      });
    } catch (e) {
      console.error(e);
    }
  }

  async onMessageDelete(message: Message) {
    const revoltMessage = Main.discordCache.find(
      (msg) => msg.discordId === message.id
    )?.revoltId;

    if (!revoltMessage) return;

    const revoltChannel = Main.mappings.find(
      (mapping) => mapping.discord === message.channelId
    )?.revolt;

    if (!revoltChannel) return;

    const revoltBot = Main.bots.revolt;
    const channel = await revoltBot.channels.fetch(revoltChannel);

    try {
      await channel.messages.delete(revoltMessage);
    } catch (e) {
      console.error(e);
    }
  }

  async onInteraction(interaction) {
    if (!interaction.isCommand()) return;

    if (!isElevated(interaction.member)) {
      interaction.reply("You don't have permission to do that.");
      return;
    }

    slash(interaction);
  }

  login() {
    this.client.login(this.token);
  }

  private buildRevoltEmbed(author: User, content: string) {
    const embed: APIEmbed = {
      type: "text",
      icon_url: author.avatarURL(),
      title: author.username,
      description: content,
    };

    return embed;
  }

  private buildAttachments(attachments: Iterable<Attachment>) {
    const files: File[] = [];

    for (const attachment of attachments) {
      files.push(attachment.url);
    }

    return files;
  }
}
