import { Agent } from "@xmtp/agent-sdk";
import { getTestUrl } from "@xmtp/agent-sdk/debug";
import * as http from "http";

export const HealthCheck = async <ContentTypes>(agent: Agent<ContentTypes>) => {
  const server = http.createServer((_, res) => {
    const testUrl = getTestUrl(agent.client);
    res.writeHead(302, { Location: testUrl });
    res.end();
  });

  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, () => {
    console.log(`HealthCheck server listening on http://localhost:${port}`);
  });
};
