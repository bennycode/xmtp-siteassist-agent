import { Agent, f, getTestUrl, withFilter } from "@xmtp/agent-sdk";
import { loadEnvFile } from "node:process";
import { SiteAssist } from "./SiteAssist";
import { HealthCheck } from "./HealthCheck";
import assert from "node:assert";

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

agent.on(
  "message",
  withFilter(f.textOnly, (ctx) => {
    ctx.sendReaction("👀");
  })
);

agent.on("start", () => {
  HealthCheck(agent);
  console.log(`We are online: ${getTestUrl(agent)}`);
});

assert(process.env.SITEASSIST_KEY);
agent.use(SiteAssist(process.env.SITEASSIST_KEY));

await agent.start();
