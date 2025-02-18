export const streamData: string =
  "### Explanation of Scenarios: 1. **Basic Chunking**: Tests the basic functionality of splitting a string into smaller chunks with no trailing characters.2. **Chunking with Trailing Characters**: Handles cases where the string is shorter than the chunk size, leaving some trailing characters.3. **Single Character Strings**: Tests splitting a string composed entirely of single characters.4. **Empty String**: Ensures that an empty input results in an empty array.5. **Single Chunk**: Checks what happens when the chunk size is greater than or equal to the length of the string, resulting in a single-element array.6. **Small Chunk Size**: Tests the splitting logic when the chunk size is very small.";

export const mockTools = [
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather for a location",
      parameters: [
        {
          name: "location",
          type: "string",
          description:
            "The location to get the weather for, e.g. San Francisco, CA",
          required: true,
        },
        {
          name: "format",
          description:
            "The format to return the weather in, e.g. 'celsius' or 'fahrenheit'",
          type: "string",
          required: true,
        },
      ],
    },
  },
];
