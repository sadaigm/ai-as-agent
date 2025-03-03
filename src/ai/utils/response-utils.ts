import { ChatPayload, ToolCall } from "../components/types/tool";
import ToolCallManager from "../core/ToolCallManager";

export async function handleNonStreamResponse(
  response: Response,
  payload: ChatPayload,
  toolStream: boolean,
  controller: AbortController
) {
  const data = await response.json();
  if (
    data?.choices &&
    data.choices[0].finish_reason === "stop" &&
    data.choices[0]?.message?.content &&
    data.choices[0]?.message?.role === "assistant"
  ) {
    return new Promise((resolve) => {
      resolve(data.choices[0]?.message?.content);
    });
  } else if (
    data?.choices &&
    data.choices[0].finish_reason === "tool_calls" &&
    data.choices[0]?.message?.tool_calls &&
    data.choices[0]?.message?.role === "assistant"
  ) {
    const toolCalls: ToolCall[] = data.choices[0]?.message?.tool_calls;
    // fix :: add tool_calls validation
    console.log("reveived tool_calls from agent", toolCalls, data);
    const toolManager = new ToolCallManager(payload, toolCalls);
    console.log("invoking ToolCallManager to interceptToolCalls");
    const result = await toolManager.interceptToolCalls(toolStream,controller);
    console.log("interceptToolCalls : done");
    return result;
  }
}
