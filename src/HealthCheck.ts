import { Agent, getTestUrl } from "@xmtp/agent-sdk";
import http from "node:http";

export const HealthCheck = async <ContentTypes>(agent: Agent<ContentTypes>) => {
  const startedAt = new Date();

  const server = http.createServer((req, res) => {
    const response = {
      agent: "xmtp-siteassist-agent",
      startedAt: startedAt.toISOString(),
      status: "ok",
      testUrl: getTestUrl(agent),
      uptimeSec: process.uptime(),
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  });

  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, () => {
    console.log(`HealthCheck server listening on http://localhost:${port}`);
  });
};
