import { DiscordBot } from "./discord";
import { RevoltBot } from "./revolt";

export class Bot {
    private discordBot: DiscordBot;
    private revoltBot: RevoltBot;

    constructor(usingJson: boolean) {
        const discordToken = process.env.DISCORD_TOKEN;
        const revoltToken = process.env.REVOLT_TOKEN;

        if (!usingJson) {
            this.setupDiscordBot(discordToken);
        }

        this.revoltBot = new RevoltBot(revoltToken);
    }

    public start() {
        this.revoltBot.login();
    }

    public async setupDiscordBot(token: string) {
        this.discordBot = new DiscordBot(token);
        this.discordBot.login();
    }
}
