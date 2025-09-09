import { Agent, getTestUrl } from "@xmtp/agent-sdk";
import assert from "node:assert";
import { loadEnvFile } from "node:process";
import { HealthCheck } from "./HealthCheck";
import { OnlyText } from "./OnlyText";
import { SiteAssist } from "./SiteAssist";

try {
  loadEnvFile(".env");
} catch {
  console.log("No .env file found");
}

const agent = await Agent.create(undefined, {
  dbPath: null,
});

agent.on("start", () => {
  HealthCheck(agent);
  console.log(`We are online: ${getTestUrl(agent)}`);
});

assert(process.env.SITEASSIST_KEY);

agent.use(OnlyText());
agent.use(SiteAssist(process.env.SITEASSIST_KEY));

await agent.start();
