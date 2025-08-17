import { UniversalMessage } from "../interfaces";

export default async function help(message: UniversalMessage) {
    message.reply("Available commands: `rc!help`, `rc!ping`, `rc!connect`, `rc!disconnect`, `rc!connections`, `rc!bots`");
}
