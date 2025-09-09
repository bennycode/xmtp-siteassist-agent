import { AgentContext, AgentMiddleware, isText } from "@xmtp/agent-sdk";

export function OnlyText(): AgentMiddleware {
  return async ({ message }: AgentContext, next) => {
    if (!isText(message)) {
      return;
    }

    await next();
  };
}
