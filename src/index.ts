import { Agent, getTestUrl } from "@xmtp/agent-sdk";
import { loadEnvFile } from "node:process";
import { SiteAssist } from "./SiteAssist";

try {
  loadEnvFile(".env");
} catch {
  console.log("No .env file found");
}

const agent = await Agent.create(undefined, {
  dbPath: null,
});

agent.on("error", (error) => {
  console.log("Caught error", error);
});

agent.on("start", () => {
  console.log(`We are online: ${getTestUrl(agent)}`);
});

agent.use(SiteAssist);

await agent.start();
