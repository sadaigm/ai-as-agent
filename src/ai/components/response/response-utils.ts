export const parseResponse = (
      response: string
    ): { thinkingContent: string | null; parsedResponse: string | null } => {
      const thinkStartEndTag = /<think>([\s\S]*?)<\/think>/;
      const thinkOnlyStartTag = /<think>([\s\S]*?)$/;

      if (thinkStartEndTag.test(response)) {
        const match = response.match(thinkStartEndTag);
        if (match) {
          return {
            thinkingContent: match[1].trim(),
            parsedResponse: response.replace(match[0], "").trim(),
          };
        }
      } else if (thinkOnlyStartTag.test(response)) {
        const match = response.match(thinkOnlyStartTag);
        if (match) {
          return {
            thinkingContent: match[1].trim(),
            parsedResponse: null,
          };
        }
      }

      return { thinkingContent: null, parsedResponse: response.trim() };
    };