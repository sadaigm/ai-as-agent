import { ChatPayload, ToolCall } from "../components/types/tool";
import ToolCallManager from "../core/ToolCallManager";

export async function handleNonStreamResponse(
  response: Response,
  payload: ChatPayload
) {
  const data = await response.json();
  if (
    data?.choices &&
    data.choices[0].finish_reason === "stop" &&
    data.choices[0]?.message?.content &&
    data.choices[0]?.message?.role === "assistant"
  ) {
    return data.choices[0]?.message?.content;
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
    const result: any = await toolManager.interceptToolCalls();
    console.log("interceptToolCalls : done");
    return result;
  }
}
