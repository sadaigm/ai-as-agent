import { message } from "antd";
import ChatService, { createChatService } from "../services/ChatService";
import { ChatPayload } from "../components/types/tool";
import { handleNonStreamResponse } from "../utils/response-utils";

interface SubmitHandlerParams {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResponseData: React.Dispatch<React.SetStateAction<any>>;
  setStreamingData: React.Dispatch<React.SetStateAction<string|null>>;
  setAbortController: React.Dispatch<
    React.SetStateAction<AbortController | null>
  >;
}

export const useSubmitHandler = ({
  setLoading,
  setResponseData,
  setStreamingData,
  setAbortController,
}: SubmitHandlerParams) => {
  const chatService: ChatService = createChatService();
  const handleSubmit = async (payload: ChatPayload) => {
    setLoading(true);
    setResponseData(null);
    setStreamingData("");
    console.log({ payload });

    const controller = new AbortController();
    setAbortController(controller);

    // const payload: ChatPayload = {
    //   model: values.model,
    //   messages: [
    //     { role: "system", content: values.systemPrompt },
    //     { role: "user", content: values.userPrompt },
    //   ],
    //   temperature: values.temperature,
    //   stream: values.stream,
    // };
    if (payload.tools) {
      payload.stream = false;
    }

    try {
      const response = await chatService.invoke(payload, controller);

      if (!response.ok) {
        throw new Error("Failed to send request");
      }

      if (payload.stream) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let text = "";

        while (!done) {
          const { value, done: readerDone } = (await reader?.read()) || {};
          done = readerDone || false;

          if (controller.signal.aborted) {
            break;
          }

          if (value) {
            text += decoder.decode(value, { stream: true });

            const chunks = text.split("data: ");
            let chunk = chunks[1];

            if (chunk.trim()) {
              try {
                const formattedJSON = JSON.parse(chunk);

                if (
                  formattedJSON?.choices &&
                  formattedJSON.choices[0]?.delta?.content
                ) {
                  setStreamingData(
                    (prevData) =>
                      prevData + formattedJSON.choices[0].delta.content
                  );
                }
              } catch (error) {
                console.log("Waiting for valid JSON...");
              }
            }

            text = chunks[chunks.length - 1];
          }
        }

        message.success("Streaming completed");
      } else {
        handleNonStreamResponse(response, payload).then((data) => {
          if (data) {
            setResponseData(data);
            setLoading(false);
          }
        });
        // Promise.resolve();
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request was canceled");
      } else {
        message.error(`Error: ${error.message}`);
      }
      setLoading(false);
    }
  };

  return handleSubmit;
};
