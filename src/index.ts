import { Agent } from "@xmtp/agent-sdk";
import { getTestUrl } from "@xmtp/agent-sdk/debug";
import assert from "node:assert";
import { loadEnvFile } from "node:process";
import { HealthCheck } from "./HealthCheck";

try {
  loadEnvFile(".env");
} catch {
  console.log("No .env file found");
} finally {
  // https://app.siteassist.io/.../.../api-keys/secrets
  assert(process.env.SITEASSIST_SECRET_KEY);
}

const agent = await Agent.createFromEnv();

agent.on("unhandledError", (error) => {
  console.log("Caught error", error);
});

agent.on("start", (ctx) => {
  HealthCheck(agent);
  console.log(`We are online: ${getTestUrl(ctx.client)}`);
});

agent.on("dm", (ctx) => {
  ctx.conversation.send("Hello you!");
});

agent.on("group", (ctx) => {
  ctx.conversation.send("Hello everyone!");
});

// agent.use([OnlyText(), SiteAssist(process.env.SITEASSIST_SECRET_KEY)]);

await agent.start();
