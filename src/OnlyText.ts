import { AgentMiddleware, filter, MessageContext } from "@xmtp/agent-sdk";

export function OnlyText(): AgentMiddleware {
  return async ({ message }: MessageContext, next) => {
    if (!filter.isText(message)) {
      return;
    }

    await next();
  };
}
