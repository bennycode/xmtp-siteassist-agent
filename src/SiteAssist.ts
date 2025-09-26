import {
  AgentMiddleware,
  MessageContext,
  SortDirection,
} from "@xmtp/agent-sdk";
import { AIMessage, ChatCompletionResponse } from "./types";

const SITEASSIST_API_URI = "https://api.siteassist.io";

export function SiteAssist(siteassistSecretKey: string): AgentMiddleware {
  return async (ctx: MessageContext, next) => {
    await ctx.sendReaction("👀");

    // Get last 10 messages to provide the AI a history of the conversation
    const messagesHistory = await ctx.conversation.messages({
      limit: 10,
      contentTypes: [1, 6],
      direction: SortDirection.Descending,
    });

    // Convert XMTP messages to AI Messages
    const messages = messagesHistory.toReversed().map(
      (message) =>
        ({
          role:
            message.senderInboxId === ctx.message.senderInboxId
              ? "user"
              : "assistant",
          content: String(message.content),
        } satisfies AIMessage)
    );

    // API Doc https://api.siteassist.io/v2#tag/chat-completions/post/chat/completions
    const res = await fetch(`${SITEASSIST_API_URI}/v2/chat/completions`, {
      method: "POST",
      body: JSON.stringify({
        messages,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${siteassistSecretKey}`,
      },
    });

    if (res.ok) {
      const { steps } = (await res.json()) as ChatCompletionResponse;
      const finalStep = steps[steps.length - 1];

      if (finalStep) {
        const replyContent = finalStep.content
          .filter((content) => content.type === "text")
          .map((c) => c.text?.trim())
          .filter((text) => !!text)
          .join("\n\n");

        await ctx.sendTextReply(replyContent);
      }
    } else {
      console.error("Something went wrong", res);
    }

    await next();
  };
}
