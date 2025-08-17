import { Command } from "../interfaces";
import allowBots from "./allowBots";
import connect from "./connect";
import disconnect from "./disconnect";
import help from "./help";
import listConnections from "./listConnections";
import ping from "./ping";

const commands: Command[] = [
    {
        name: "ping",
        handler: ping,
    },
    {
        name: "help",
        handler: help,
    },
    {
        name: "connect",
        handler: connect,
    },
    {
        name: "disconnect",
        handler: disconnect,
    },
    {
        name: "connections",
        handler: listConnections,
    },
    {
        name: "bots",
        handler: allowBots,
    },
];

export default commands;
