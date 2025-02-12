import { message } from "antd";
import { useEffect, useState } from "react";
import { HOST_URL_VERSION_PATH } from "../const";

export const useModels = () => {
    const [models, setModels] = useState([]);
    // Fetch the list of models from the API when the component mounts
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(HOST_URL_VERSION_PATH + "/models");
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