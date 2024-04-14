import fs from "fs";
import yaml from "js-yaml";

export default function loadYamlFile(filePath: string): any {
    try {
      // Read the file contents
      const fileContents = fs.readFileSync(filePath, "utf8");
      // Parse the YAML content
      const data = yaml.load(fileContents);
      return data;
    } catch (e) {
      console.error(`Failed to read or parse the YAML file: ${e}`);
      return null;
    }
  }