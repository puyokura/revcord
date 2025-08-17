import { Command } from "../interfaces";
import allowBots from "./allowBots";
import connect from "./connect";
import disconnect from "./disconnect";
import listConnections from "./listConnections";

const commands: Command[] = [
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
