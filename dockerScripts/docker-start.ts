import { config } from "dotenv";
import {
  defaultPort,
  getPackageNameAndVersion,
  runDockerCommand,
} from "./utils";

config();

const port = process.env.PORT || defaultPort;

const nameAndVersion = getPackageNameAndVersion();

const dockerRunCommand = `docker run --name ${
  nameAndVersion.name
}_${Date.now()} -p ${port}:${port} --env-file .env ${nameAndVersion.name}:${
  nameAndVersion.version
}`;

runDockerCommand(dockerRunCommand);
