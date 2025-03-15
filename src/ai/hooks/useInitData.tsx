import {
  AI_ROLES_KEY,
  AI_TOOLS_KEY,
  DEFAULT_AI,
  ENVIRONMENTS_KEY,
  getDefaultAI,
} from "../utils/service";
import prompts from "../../data/prompts.json";
import { Environment } from "../components/types/environment";
import { API_VERSION_PATH, HOST_URL } from "../const";

export const useInitData = () => {
  const roles = localStorage.getItem(AI_ROLES_KEY);
  if (!roles) {
    console.log("roles not found, load the default roles....");
    localStorage.setItem(AI_ROLES_KEY, JSON.stringify(prompts));
  }

  const tools = localStorage.getItem(AI_TOOLS_KEY);
  if (!tools) {
    console.log("tools not found, load the default tools....");
  }

  if (!getDefaultAI()) {
    const defaultAI: Environment = {
      id: "1",
      name: "Default AI Environment",
      type: "AI",
      hostUrl: HOST_URL,
      appBasePath: API_VERSION_PATH,
      headers: [],
    };
    const environments = localStorage.getItem(ENVIRONMENTS_KEY);
    if (!environments) {
      const aiEnvs = [];
      console.log("environments not found, load the default environments....");
      aiEnvs.push(defaultAI);
      localStorage.setItem(ENVIRONMENTS_KEY, JSON.stringify(aiEnvs));
      localStorage.setItem(DEFAULT_AI, JSON.stringify(defaultAI));
    } else {
      const envObject = JSON.parse(environments);
      const aiEnvs = envObject.filter((env: any) => env.type === "AI") || [];
      if (aiEnvs.length === 0) {
        console.log(
          "AI environments not found, load the default AI environments...."
        );

        envObject.push(defaultAI);
        localStorage.setItem(ENVIRONMENTS_KEY, JSON.stringify(envObject));
        localStorage.setItem(DEFAULT_AI, JSON.stringify(defaultAI));
      } else {
        console.log("AI environments found....");
        localStorage.setItem(DEFAULT_AI, JSON.stringify(aiEnvs[0]));
      }
    }
  }
};
