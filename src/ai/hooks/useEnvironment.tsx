import { useEffect, useState } from "react";
import { getEnvironments, saveEnvironments, deleteEnvironmentByName } from "../utils/service";
import { Environment } from "../components/types/environment";

type EnvironmentHookReturnType = {
  errorMessage: any;
  environments: Environment[];
  saveEnvironment: (environment: Environment) => void;
  deleteEnvironment: (name: string) => void;
};

export const useEnvironment = (): EnvironmentHookReturnType => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    getEnvironments()
      .then((envs) => {
        setEnvironments(envs);
      })
      .catch((error) => {
        console.error("Error fetching environments", error);
        setErrorMessage(error);
      });
  }, []);

  const saveEnvironment = (environment: Environment) => {
    const filtered = environments.filter((env) => env.name !== environment.name);
    const updated = [...filtered, environment];
    setEnvironments(updated);
    saveEnvironments(updated);
  };

  const deleteEnvironment = (name: string) => {
    const updatedEnvironments = environments.filter((env) => env.name !== name);
    setEnvironments(updatedEnvironments);
    deleteEnvironmentByName(name);
  };

  return { errorMessage, environments, saveEnvironment, deleteEnvironment };
};