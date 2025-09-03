import { AgentContext, AgentMiddleware, isText } from "@xmtp/agent-sdk";
import assert from "node:assert";
import { createHash } from "node:crypto";

function uuidv4FromId(id: string): string {
  // 1) Hash to 32 bytes, take first 16
  const hash = createHash("sha256").update(id, "utf8").digest();
  const b = Uint8Array.from(hash.subarray(0, 16));

  // 2) Set version 4 and RFC 4122 variant
  b[6] = (b[6] & 0x0f) | 0x40; // version
  b[8] = (b[8] & 0x3f) | 0x80; // variant

  return bytesToUuid(b);
}

function bytesToUuid(b: Uint8Array): string {
  const hex = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

export function SiteAssist(siteAssistKey: string): AgentMiddleware<unknown> {
  return async (ctx: AgentContext, next) => {
    if (!isText(ctx.message)) {
      return;
    }

    if ((await ctx.getSenderAddress()) === ctx.getOwnAddress()) {
      return;
    }

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

    next();
  };
}
