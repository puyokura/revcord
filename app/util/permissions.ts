import { GuildMember, PermissionsBitField } from "discord.js";

export default function isElevated(member: GuildMember) {
  return member.permissions.has(PermissionsBitField.Flags.Administrator);
}
