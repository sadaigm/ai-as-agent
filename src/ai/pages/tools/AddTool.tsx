import { Modal, Form, Input, List, Checkbox, Button, Select } from "antd";
import { FC, useEffect, useState } from "react";
import { Parameter, Tool } from "./ToolItem";
import { ChatPayload } from "../../components/types/tool";
import { useSubmitHandler } from "../../hooks/useSubmitHandler";
import ParameterList from "./ParameterList";
import SelectEnvironment from "../../components/agent-ui/SelectEnvironment";
import { Environment } from "../../components/types/environment";

const { TextArea } = Input;
const { Option } = Select;

type AddToolProps = {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  saveTool: (tool: Tool) => void;
};

const AddTool: FC<AddToolProps> = ({
  saveTool,
  isModalVisible,
  setIsModalVisible,
}) => {
  const [toolName, setToolName] = useState<string | undefined>(undefined);
  const [toolType, setToolType] = useState<string | undefined>(undefined);
  const [method, setMethod] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [streamingData, setStreamingData] = useState<string | null>("");
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleSubmit = useSubmitHandler({
    setLoading,
    setResponseData,
    setStreamingData,
    setAbortController,
  });
  const getToolDescription = async () => {
    console.log({ toolName });
    if (!toolName) {
      return;
    }
    const payload: ChatPayload = {
      model: localStorage.getItem("selectedModel") || "llama-3.2-1b-instruct",
      messages: [
        { role: "system", content: "You are a Document writer." },
        {
          role: "user",
          content: `write a single line tool description for the toolname: ${toolName} so the use will understand what the tool does. just return description DONOT add explaination`,
        },
      ],
      temperature: 0.8,
      stream: false,
    };
    handleSubmit(payload);
  };

  useEffect(() => {
    if (responseData && responseData !== null) {
      const strippedDescription = responseData.replace(/^"|"$/g, "");
      console.log("Tool Description: ", strippedDescription);
      form.setFieldsValue({ function: { description: strippedDescription } });
    }
  }, [responseData]);
  const [form] = Form.useForm();
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const handleAddTool = () => {
    form
      .validateFields()
      .then((values) => {
        const newTool: Tool = {
          type: values.type,
          id: Math.random().toString(36).substr(2, 9),
          toolName: values.function.name,
          function: {
            name: values.function.name,
            description: values.function.description,
            parameters: parameters,
          },
          method: values.method,
          url: values.url,
          bodyType: values.bodyType,
          apiPath: values.apiPath,
          environmentId: values.environmentId,
        };
        saveTool(newTool);
        setIsModalVisible(false);
        form.resetFields();
        setParameters([]);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setParameters([]);
  };

  const addParameter = () => {
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
        setParameters([...parameters, newParam]);
        form.resetFields([
          "paramName",
          "paramType",
          "paramDescription",
          "paramRequired",
          "paramEnum",
        ]);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const [paramFieldsFilled, setParamFieldsFilled] = useState(false);

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
    <Modal
      title="Add New Tool"
      visible={isModalVisible}
      onOk={handleAddTool}
      onCancel={handleCancel}
      width={800}
    >
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
        <Form.Item
          name={["function", "name"]}
          label="Function Name"
          rules={[
            { required: true, message: "Please input the function name!" },
          ]}
        >
          <Input
            onChange={(e) => {
              setToolName(e.target.value);
            }}
          />
        </Form.Item>
        <div style={{ marginTop: "5px" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => getToolDescription()}
          >
            {loading ? `Generating` : `Ask for tool description`}
          </Button>
        </div>
        <Form.Item
          name={["function", "description"]}
          label="Function Description"
          rules={[
            {
              required: true,
              message: "Please input the function description!",
            },
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          name="type"
          label="Tool Type"
          rules={[{ required: true, message: "Please select the tool type!" }]}
        >
          <Select onChange={(value) => setToolType(value)}>
            <Option value="function">Function</Option>
            <Option value="rest">Rest</Option>
          </Select>
        </Form.Item>
        {toolType === "rest" && (
          <>
            <Form.Item
              name="method"
              label="Method"
              rules={[{ required: true, message: "Please select the method!" }]}
            >
              <Select onChange={(value) => setMethod(value)}>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="environmentId"
              label="Environment"
              rules={[{ required: false, message: "Please select the method!" },
              ]}
            >
              <SelectEnvironment
                onChange={(value: string, env: Environment) => {
                  if (value === "") {
                    form.setFieldValue("url", undefined);
                    form.setFieldValue("environmentId", undefined);
                  } else {
                    form.setFieldValue("url", env.hostUrl);
                    form.setFieldValue("environmentId", value);
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="url"
              label="URL"
              rules={[
              { required: true, message: "Please input the URL!" },
              { type: "url", message: "Please enter a valid URL!" },
              {
                validator: (_, value) =>
                value && value.endsWith("/")
                  ? Promise.reject(new Error("URL should not end with a '/'"))
                  : Promise.resolve(),
              },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="apiPath"
              label="API Path"
              rules={[
                { required: true, message: "Please input the Api Path!" },
                { type: "string", message: "Please enter a valid Api Path!" },
                {
                  validator: (_, value) =>
                  value && value.startsWith("/")
                    ? 
                    Promise.resolve()
                    :
                    Promise.reject(new Error("URL should start with a '/'")),
                     
                },
              ]}
            >
              <Input />
            </Form.Item>
            {method === "POST" && (
              <Form.Item
                name="bodyType"
                label="Body Type"
                rules={[
                  { required: true, message: "Please select the body type!" },
                ]}
              >
                <Select>
                  <Option value="string">String</Option>
                  <Option value="json">JSON</Option>
                </Select>
              </Form.Item>
            )}
          </>
        )}
        <ParameterList parameters={parameters} setParameters={setParameters} />
      </Form>
    </Modal>
  );
};

export default AddTool;
