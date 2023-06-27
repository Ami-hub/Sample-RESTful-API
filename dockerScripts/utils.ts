import { readFileSync } from "fs";
import { execSync } from "child_process";

export const defaultPort = 3000;
export const defaultName = "mfix_api";
export const defaultVersion = "latest";

export const getPackageNameAndVersion = () => {
  try {
    const packageJson = readFileSync("./package.json", "utf8");
    const { version, name } = JSON.parse(packageJson);
    return { name, version };
  } catch (err) {
    return { name: defaultName, version: defaultVersion };
  }
};

export const runDockerCommand = (command: string) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (err) {
    console.error(`\nERROR: Cannot run the docker command due to:`);
    console.error((err as Error).message);
  }
};
