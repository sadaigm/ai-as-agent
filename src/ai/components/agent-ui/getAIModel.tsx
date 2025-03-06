import { Select } from "antd";
import React, { FC } from "react";
import { useModels } from "../../hooks/useModels";

type GetAIModelProps = {
  defaultValue?: string;
  onChange: (value: string) => void;
};

const GetAIModel: FC<GetAIModelProps> = ({ onChange, defaultValue }) => {
  const { models } = useModels();
  return (
    <Select
      defaultValue={defaultValue}
      placeholder="Select a model"
      onSelect={(value) => {
        localStorage.setItem("selectedModel", value);
        onChange(value as string);
      }}
      allowClear
    >
      {models.map((model: any) => (
        <Select.Option key={model.id} value={model.id}>
          {model.id}
        </Select.Option>
      ))}
    </Select>
  );
};

export default GetAIModel;
