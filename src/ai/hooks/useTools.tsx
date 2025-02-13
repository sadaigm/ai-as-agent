import { useEffect, useState } from "react";
import { getTools, saveTools } from "../utils/service";
import { Tool } from "../components/types/tool";

type ToolsHookReturnType = {
  errorMessage: any;
  tools: Tool[];
  saveTool: (tool: Tool) => void;
};

export const useTools = (): ToolsHookReturnType => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [errorMessage, seterrorMessage] = useState(undefined);
  useEffect(() => {
    getTools()
      .then((tools) => {
        setTools(tools);
      })
      .catch((error) => {
        console.error("Error fetching tools", error);
        seterrorMessage(error);
      });
  }, []);

  const saveTool = (tool: Tool) => {
    const filtered = tools.filter((t) => t.id !== tool.id);
    const updated = [...filtered, tool];
    setTools(updated);
    saveTools(updated);
  };
  return { errorMessage, tools, saveTool };
};
