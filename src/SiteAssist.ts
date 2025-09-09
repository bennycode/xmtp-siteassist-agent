import { AgentContext, AgentMiddleware, f, isText } from "@xmtp/agent-sdk";
import { uuidv4FromId } from "./util";

export function SiteAssist(siteAssistKey: string): AgentMiddleware<unknown> {
  return async (ctx: AgentContext, next) => {
    ctx.sendReaction("👀");

    const domain = `api.siteassist.io`;
    const userId = await ctx.getSenderAddress();
    const conversationId = crypto.randomUUID();
    const text = ctx.message.content;
    const customerId = uuidv4FromId(userId);
    const chatId = uuidv4FromId(conversationId);

    await fetch(`https://${domain}/v1/customers/${customerId}`, {
      headers: {
        "x-siteassist-key": siteAssistKey,
      },
    });

    const res = await fetch(
      `https://${domain}/v1/customers/${customerId}/chats/${chatId}/chat`,
      {
        method: "POST",
        body: JSON.stringify({
          id: chatId,
          streaming: false,
          message: {
            role: "user",
            parts: [{ type: "text", text }],
          },
        }),
        headers: {
          "Content-Type": "application/json",
          "x-siteassist-key": siteAssistKey,
        },
      }
    );

    if (res.ok) {
      const responseText = await res.text();
      ctx.sendText(responseText);
    } else {
      console.error("Something went wrong", res);
    }

    await next();
  };
}
