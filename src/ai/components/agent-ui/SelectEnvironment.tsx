import React, { FC } from "react";
import { useEnvironment } from "../../hooks/useEnvironment";
import { Select } from "antd";
import { Environment } from "../types/environment";

type SelectEnvironmentProps = {
  envType?: "AI" | "Tool";
  defaultValue?: string;
  onChange: (value: string, environment: Environment) => void;
};

const SelectEnvironment: FC<SelectEnvironmentProps> = ({
  envType,
  defaultValue,
  onChange,
}) => {
  const { environments } = useEnvironment();

  return (
    <Select
      defaultValue={defaultValue}
      placeholder="Select a Environment"
      onSelect={(value) => {
        console.log(value)
        const env = environments.find((env) => env.id === value);
        if (env) {
          onChange(value as string, env as Environment);
        }
      }}
      onClear={() => onChange("", {} as Environment)}
      allowClear
    >
      {environments
        .filter((e) => (envType ? e.type.toUpperCase() === envType.toUpperCase() : true))
        .map((environment: Environment) => (
          <Select.Option key={environment.id} value={environment.id}>
            {environment.name}
          </Select.Option>
        ))}
    </Select>
  );
};

export default SelectEnvironment;
