export interface ChatCompletionResponse {
  steps: {
    content: {
      type: string;
      text?: string;
    }[];
    finishReason: string;
    usage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
      reasoningTokens: number;
      cachedInputTokens: number;
    };
  }[];
}

export interface AIMessage {
  role: "assistant" | "user" | "system";
  content: string;
}
