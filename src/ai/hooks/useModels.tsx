import { message } from "antd";
import { useEffect, useState } from "react";
import { HOST_URL_VERSION_PATH } from "../const";
import { getDefaultAI } from "../utils/service";

export const useModels = () => {
    const [models, setModels] = useState([]);
    // Fetch the list of models from the API when the component mounts
  useEffect(() => {
    const fetchModels = async () => {
      try {
        let aiHosrUrl = `${HOST_URL_VERSION_PATH}`;
        const env = getDefaultAI();
        if (env) {
          aiHosrUrl = `${env.hostUrl}${env.appBasePath||""}`;
        }
        console.log("fetching models from", aiHosrUrl);
        const response = await fetch(aiHosrUrl + "/models");
        const data = await response.json();
        if (data && data.data) {
          setModels(data.data); // Set models in state
        } else {
          message.error("Failed to fetch models");
        }
      } catch (error) {
        message.error("Error fetching models");
      }
    };

    fetchModels();
  }, []); // Empty dependency array to fetch once when component mounts
  return {models}
}