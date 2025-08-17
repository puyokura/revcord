import fs from "fs/promises";
import { Mapping } from "../interfaces";

export default async function getMappings(): Promise<Mapping[]> {
  const mappings = await fs.readFile("mappings.json", "utf8");
  return JSON.parse(mappings);
}
