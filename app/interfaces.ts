import { User, Channel } from "revolt.js";

export interface Mapping {
    discord: string;
    revolt: string;
    allowBots?: boolean;
}

export interface CachedMessage {
    revoltId: string;
    discordId: string;
}

export interface Command {
    name: string;
    handler: (message: UniversalMessage) => void;
}

export interface UniversalMessage {
    author: User;
    channel: Channel;
    channelId: string;
    command: string;
    args: string[];
    reply: (message: string) => void;
}
