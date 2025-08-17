import { DataTypes, Model, Optional } from "sequelize";

interface MappingAttributes {
    id: number;
    discordChannel: string;
    revoltChannel: string;
    discordChannelName: string;
    revoltChannelName: string;
    allowBots: boolean;
}

interface MappingCreationAttributes extends Optional<MappingAttributes, "id"> {}

export class MappingModel extends Model<MappingAttributes, MappingCreationAttributes> implements MappingAttributes {
    public id!: number;
    public discordChannel!: string;
    public revoltChannel!: string;
    public discordChannelName!: string;
    public revoltChannelName!: string;
    public allowBots!: boolean;
}
