import React, { FC, useEffect, useState } from "react";
import { Form, Input, List, Checkbox, Button } from "antd";
import { Parameter } from "./ToolItem";

interface ParameterListProps {
  parameters: Parameter[];
  setParameters: (params: Parameter[]) => void;
}

const ParameterList: FC<ParameterListProps> = ({ parameters, setParameters }) => {
  const [form] = Form.useForm();
  const [paramFieldsFilled, setParamFieldsFilled] = useState(false);
  const [editingParamIndex, setEditingParamIndex] = useState<number | null>(null);

  const addOrUpdateParameter = () => {
    form
      .validateFields([
        "paramName",
        "paramType",
        "paramDescription",
        "paramRequired",
        "paramEnum",
      ])
      .then((values) => {
        const newParam: Parameter = {
          name: values.paramName,
          type: values.paramType,
          description: values.paramDescription,
          required: values.paramRequired,
          enum: values.paramEnum ? values.paramEnum.split(",") : undefined,
        };
        if (editingParamIndex !== null) {
          const updatedParameters = [...parameters];
          updatedParameters[editingParamIndex] = newParam;
          setParameters(updatedParameters);
        } else {
          setParameters([...parameters, newParam]);
        }
        form.resetFields([
          "paramName",
          "paramType",
          "paramDescription",
          "paramRequired",
          "paramEnum",
        ]);
        setEditingParamIndex(null);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const editParameter = (index: number) => {
    const param = parameters[index];
    form.setFieldsValue({
      paramName: param.name,
      paramType: param.type,
      paramDescription: param.description,
      paramRequired: param.required,
      paramEnum: param.enum ? param.enum.join(",") : undefined,
    });
    setEditingParamIndex(index);
  };

  const deleteParameter = (index: number) => {
    const updatedParameters = parameters.filter((_, i) => i !== index);
    setParameters(updatedParameters);
    form.resetFields([
      "paramName",
      "paramType",
      "paramDescription",
      "paramRequired",
      "paramEnum",
    ]);
    setEditingParamIndex(null);
  };

  useEffect(() => {
    const fields = form.getFieldsValue([
      "paramName",
      "paramType",
      "paramDescription",
      "paramRequired",
      "paramEnum",
    ]);
    setParamFieldsFilled(
      fields.paramName ||
        fields.paramType ||
        fields.paramDescription ||
        fields.paramRequired ||
        fields.paramEnum
    );
  }, [form]);

  return (
    <>
      <h3>Parameters:</h3>
      <List
        dataSource={parameters}
        renderItem={(param, index) => (
          <List.Item
            key={index}
            actions={[
              <Button type="link" onClick={() => editParameter(index)}>Edit</Button>,
              <Button type="link" danger onClick={() => deleteParameter(index)}>Delete</Button>,
            ]}
          >
            <strong>{param.name}</strong>: {param.type} - {param.description}{" "}
            {param.required ? "(Required)" : "(Optional)"}
          </List.Item>
        )}
      />
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => {
          const fields = form.getFieldsValue([
            "paramName",
            "paramType",
            "paramDescription",
            "paramRequired",
            "paramEnum",
          ]);
          setParamFieldsFilled(
            fields.paramName ||
              fields.paramType ||
              fields.paramDescription ||
              fields.paramRequired ||
              fields.paramEnum
          );
        }}
      >
        <Form.Item name="paramName" label="Parameter Name">
          <Input />
        </Form.Item>
        <Form.Item name="paramType" label="Parameter Type">
          <Input />
        </Form.Item>
        <Form.Item name="paramDescription" label="Parameter Description">
          <Input />
        </Form.Item>
        <Form.Item name="paramRequired" valuePropName="checked" label="Parameter Required">
          <Checkbox />
        </Form.Item>
        <Form.Item name="paramEnum" label="Parameter Enum (comma separated)">
          <Input />
        </Form.Item>
        <Button type="dashed" onClick={addOrUpdateParameter} disabled={!paramFieldsFilled}>
          {editingParamIndex !== null ? "Update Parameter" : "+ Add Parameter"}
        </Button>
      </Form>
    </>
  );
};

export default ParameterList;
