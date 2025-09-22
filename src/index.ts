import assert from "node:assert";
import { getTestUrl } from "@xmtp/agent-sdk/debug";
import { loadEnvFile } from "node:process";
import { HealthCheck } from "./HealthCheck";
import { OnlyText } from "./OnlyText";
import { SiteAssist } from "./SiteAssist";
import { Agent } from "@xmtp/agent-sdk";

try {
  loadEnvFile(".env");
} catch {
  console.log("No .env file found");
} finally {
  assert(process.env.SITEASSIST_KEY);
}

const agent = await Agent.createFromEnv();

agent.on("unhandledError", (error) => {
  console.log("Caught error", error);
});

agent.on("start", (ctx) => {
  HealthCheck(agent);
  console.log(`We are online: ${getTestUrl(ctx.client)}`);
});

agent.use([OnlyText(), SiteAssist(process.env.SITEASSIST_KEY)]);

await agent.start();
