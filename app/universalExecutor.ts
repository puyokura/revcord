import { Command, UniversalMessage } from "./interfaces";

export default async function universalExecutor(message: UniversalMessage, commands: Command[]) {
    const command = commands.find((c) => c.name === message.command);
    if (command) {
        command.handler(message);
    }
}
