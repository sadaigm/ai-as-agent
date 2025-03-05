import { useEffect, useState } from "react";
import { getTools, saveTools } from "../utils/service";
import { Tool } from "../components/types/tool";

type ToolsHookReturnType = {
  errorMessage: any;
  tools: Tool[];
  saveTool: (tool: Tool) => void;
  saveToolImport: (tools: Tool[]) => void;
  deleteTool: (id: string) => void;
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

  const saveToolImport = (itools: Tool[]) => {
    const inames = itools.map(i => i.function.name);
    const filtered = tools.filter((t) => !inames.includes(t.function.name));
    const updated = [...filtered, ...itools];
    setTools(updated);
    saveTools(updated);
  };

  const deleteTool = (id: string) => {
    const updatedTools = tools.filter((tool) => tool.id !== id);
    setTools(updatedTools);
    saveTools(updatedTools);
  };

  return { errorMessage, tools, saveTool, saveToolImport, deleteTool };
};
