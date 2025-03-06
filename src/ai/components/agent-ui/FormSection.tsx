import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  message,
  Modal,
  InputNumber,
  List,
  Typography,
  Divider,
  Card,
  Space,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getSystemPromptTemplates as getRoleSystemPromptTemplates,
  getTools,
} from "../../utils/service";
import { getFuncParamsString } from "../../utils/function";
import {
  ChatHistory,
  SystemRolePrompt,
  Tool,
  UserMessage,
  ToolMessage,
  convertTools2AgentTools,
  ChatPayload,
} from "../types/tool";
import { useSubmitHandler } from "../../hooks/useSubmitHandler";
import { useModels } from "../../hooks/useModels";
import { getFullPrompt } from "../../const";
import { AgentToolFunctionResponse } from "../../core/AgentToolFunction";
import GetAIModel from "./getAIModel";
import GetAIRoles from "./GetAIRoles";
import GetAITools from "./GetAITools";

const { TextArea } = Input;

const ToolList = getTools();

interface FormSectionProps {
  setConversation: React.Dispatch<
    React.SetStateAction<
      Array<UserMessage | ToolMessage | AgentToolFunctionResponse>
    >
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResponseData: React.Dispatch<React.SetStateAction<string | null>>;
  setStreamingData: React.Dispatch<React.SetStateAction<string | null>>;
  setAbortController: React.Dispatch<
    React.SetStateAction<AbortController | null>
  >;
  conversation: Array<UserMessage | ToolMessage | AgentToolFunctionResponse>;
  chatHistory: ChatHistory;
  setchatHistory: React.Dispatch<React.SetStateAction<ChatHistory>>;
  useConversation: boolean;
  setUseConversation: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  abortController: AbortController | null;
}

const FormSection: React.FC<FormSectionProps> = ({
  setConversation,
  setLoading,
  setResponseData,
  setStreamingData,
  setAbortController,
  conversation,
  chatHistory,
  setchatHistory,
  useConversation,
  setUseConversation,
  loading,
  abortController,
}) => {
  const [form] = Form.useForm();
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sysPromptDisabled, setsysPromptDisabled] = useState(true);
  const [sysPromptData, setsysPromptData] = useState<SystemRolePrompt>(
    {} as SystemRolePrompt
  );
  const [sysPromptList, setsysPromptList] = useState<SystemRolePrompt[]>([]);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const { models } = useModels();

  useEffect(() => {
    ToolList.then((data) => {
      setAvailableTools(data);
      setAllTools(data);
    });
    getRoleSystemPromptTemplates().then((data) => {
      setsysPromptList(data);
    });
  }, []);

  const handleSubmit = useSubmitHandler({
    setLoading,
    setResponseData,
    setStreamingData,
    setAbortController,
  });

  const executeChatService = (values: any) => {
    const aiReplies = conversation.filter((c) => c.role === "assistant");
    console.log("debug", aiReplies);
    const updated = [
      ...conversation,
      { role: "user", content: values.userPrompt },
    ];
    setConversation(updated);

    const payload: ChatPayload = {
      model: values.model,
      messages: [
        { role: "system", content: getFullPrompt(values.systemPrompt) },
        ...(useConversation ? aiReplies : []), // Include aiReplies if checkbox is checked
        { role: "user", content: values.userPrompt },
      ],
      temperature: values.temperature,
      stream: values.stream,
    };
    if (values.tools) {
      payload.tools = values.tools;
    }
    handleSubmit(payload);
  };

  const handleAddTool = (tool: Tool|null) => {
    if (selectedTool) {
      const updatedTools = [...tools, selectedTool];
      const agentTools = convertTools2AgentTools(updatedTools);
      form.setFieldValue("tools", agentTools);
      setTools(updatedTools);
      console.log(
        { selectedTool },
        `${selectedTool.type}:${selectedTool.function.name} added to tools list`
      );
      message.success(
        `${selectedTool.type}:${selectedTool.function.name} added to tools list`
      );
      setIsModalVisible(false);
    }
  };

  const removeTool = (tool: Tool) => {
    const updatedTools = tools.filter(
      (t) => t.function.name !== tool.function.name
    );
    const agentTools = convertTools2AgentTools(updatedTools);
    form.setFieldValue("tools", agentTools);
    setTools(updatedTools);
    console.log(
      { tool },
      `${tool.type}:${tool.function.name} removed from tools list`
    );
    message.info(`${tool.type}:${tool.function.name} removed from tools list`);
  };

  const onToolChange = (tools: Tool[]) => {
    const agentTools = convertTools2AgentTools(tools);
    form.setFieldValue("tools", agentTools);
  }

  const handleCancel = () => {
    if (abortController) {
      abortController.abort(); // Abort the fetch request if in progress
      message.warning("Request was canceled");
      setLoading(false); // Stop loading
    }
  };

  const saveSysPrompt = React.useCallback(() => {
    setsysPromptList((prev) => {
      const filtered = prev.filter(
        (v) => v.systemRole !== sysPromptData.systemRole
      );
      const updated = [
        ...filtered,
        { ...sysPromptData, id: Date.now() },
      ] as SystemRolePrompt[];
      localStorage.setItem("aisysprompts", JSON.stringify(updated));
      return updated;
    });
  }, [sysPromptData]);

  useEffect(() => {
    const status =
      sysPromptData.systemPrompt === undefined ||
      sysPromptData.systemPrompt === "" ||
      sysPromptData.systemRole === undefined ||
      sysPromptData.systemRole === "";
    setsysPromptDisabled(status);
  }, [sysPromptData]);

  return (
    <Form
      form={form}
      onFinish={executeChatService}
      initialValues={{
        temperature: 0.8, // Set initial temperature to 0.8
        stream: true, // Set initial stream to true
      }}
      onValuesChange={(changedValues, allValues) => {
        console.log({ changedValues, allValues });
        // setConversation([]);
      }}
      layout="vertical"
    >
      <Card
        className="agent__form"
        title="AI Agent Configuration"
        bordered={false}
        style={{ flex: 1 }}
        extra={
          <Space>
            <Checkbox
              checked={useConversation}
              onChange={(e) => setUseConversation(e.target.checked)}
            >
              Use Conversation
            </Checkbox>
            <Button
              color={"primary"}
              variant="outlined"
              htmlType="submit"
              loading={loading}
            >
              Submit
            </Button>
            <Button
              color={"danger"}
              variant="outlined"
              onClick={handleCancel}
              disabled={!loading}
            >
              Cancel
            </Button>
          </Space>
        }
      >
        <Form.Item
          label="Model"
          name="model"
          rules={[{ required: true, message: "Please select a model" }]}
          >
          <GetAIModel onChange={(v) => {
            console.log({ v });
            form.setFieldValue("model", v);
          }} />
        </Form.Item>

        <Form.Item label="Select AI Role" name="systemRoleTemplate" rules={[]}>
          <GetAIRoles
            onChange={(value) => {
              console.log(value);
              if (sysPromptData.systemRole) {
                setchatHistory((prev) => {
                  return {
                    ...prev,
                    [sysPromptData.systemRole]: conversation,
                  };
                });
              }

              if (value !== "new_role") {
                const data = sysPromptList.find(
                  (r) => `${r.id}` === `${value}`
                );
                if (data) {
                  console.log({ data });
                  setsysPromptData(data);
                  form.setFieldValue("systemPrompt", data.systemPrompt);
                  form.setFieldValue("systemRole", data.systemRole);
                  if (Object.keys(chatHistory).includes(data.systemRole)) {
                    setConversation(chatHistory[data.systemRole] || []);
                  } else {
                    setConversation([]);
                  }
                }
              } else {
                setConversation([]);
                form.setFieldValue("systemRole", "");
                setsysPromptData((prev) => {
                  return {
                    ...prev,
                    systemRole: "",
                  };
                });
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="AI Role"
          name="systemRole"
          rules={[{ required: true, message: "Please input AI system role" }]}
        >
          <Input
            placeholder="Enter Role"
            onChange={(e) => {
              console.log({ c: e.target.value });
              setsysPromptData((prev) => {
                return {
                  ...prev,
                  systemRole: e.target.value || "",
                };
              });
            }}
          />
        </Form.Item>

        <Form.Item
          label="System Prompt"
          name="systemPrompt"
          initialValue={sysPromptData.systemPrompt || ""}
          rules={[{ required: true, message: "Please input system prompt" }]}
        >
          <TextArea
            placeholder="Enter system prompt"
            onChange={(e) => {
              console.log({ c: e.target.value });
              setsysPromptData((prev) => {
                return {
                  ...prev,
                  systemPrompt: e.target.value || "",
                };
              });
            }}
            rows={4}
          />
        </Form.Item>
        <div style={{ marginTop: "10px" }}>
          <Button
            disabled={sysPromptDisabled}
            color="primary"
            variant="link"
            size="small"
            onClick={() => saveSysPrompt()}
          >
            Save Prompt
          </Button>
        </div>

        <Form.Item
          label="User Prompt"
          name="userPrompt"
          rules={[{ required: true, message: "Please input user prompt" }]}
        >
          <TextArea placeholder="Enter user prompt" rows={4} />
        </Form.Item>

        <Form.Item
          label="Temperature"
          name="temperature"
          rules={[{ required: true, message: "Please input a temperature" }]}
        >
          <InputNumber
            min={0}
            max={1}
            step={0.1}
            placeholder="Enter temperature"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="stream" valuePropName="checked">
          <Checkbox>Stream</Checkbox>
        </Form.Item>
        <Divider />

        <Typography.Title level={4}>Selected Tools</Typography.Title>

        
        <Form.Item label="Tools" name="tools">
          {/* {GetAITools(tools, removeTool, availableTools, setAvailableTools, allTools, handleToolSelect)} */}

          <GetAITools onChange={onToolChange} />
        </Form.Item>
      </Card>
      
    </Form>
  );
};

export default FormSection;


