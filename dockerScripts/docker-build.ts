import { getPackageNameAndVersion, runDockerCommand } from "./utils";

const nameAndVersion = getPackageNameAndVersion();
const dockerRunCommand = `docker build -t ${nameAndVersion.name}:${nameAndVersion.version} .`;

runDockerCommand(dockerRunCommand);
