import { UniversalMessage } from "../interfaces";

export default async function ping(message: UniversalMessage) {
    message.reply("Pong!");
}
