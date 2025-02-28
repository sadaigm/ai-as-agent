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
  Row,
  Col,
  Card,
  Space,
  Empty,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./aiagent.css";
import {
  getSystemPromptTemplates as getRoleSystemPromptTemplates,
  getTools,
} from "../utils/service";
import { getFuncParamsString } from "../utils/function";
import {
  ChatHistory,
  ChatPayload,
  SystemRolePrompt,
  Tool,
  ToolMessage,
  UserMessage,
  convertTools2AgentTools,
} from "./types/tool";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock, { PreBlock } from "./response/CodeBlock";
import { useSubmitHandler } from "../hooks/useSubmitHandler";
import { useModels } from "../hooks/useModels";
import { AgentToolFunctionResponse } from "../core/AgentToolFunction";
import { getFullPrompt } from "../const";
import ResponsePanel from "./response/ResponsePanel";

const { TextArea } = Input;

const ToolList = getTools();

const AIAgentUI = () => {
  const [form] = Form.useForm();
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<string|null>(null);
  const [streamingData, setStreamingData] = useState<string|null>("");
  const { models } = useModels();
  const [sysPromptDisabled, setsysPromptDisabled] = useState(true);
  const [sysPromptData, setsysPromptData] = useState<SystemRolePrompt>(
    {} as SystemRolePrompt
  );
  const [sysPromptList, setsysPromptList] = useState<SystemRolePrompt[]>([]);
  const [availableTools, setAvailableTools] = React.useState<Tool[]>([]);
  const [allTools, setAllTools] = React.useState<Tool[]>([]);
  const [chatHistory, setchatHistory] = useState<ChatHistory>({});

  const [conversation, setConversation] = useState<
    Array<UserMessage | ToolMessage | AgentToolFunctionResponse>
  >([]);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  React.useEffect(() => {
    ToolList.then((data) => {
      setAvailableTools(data);
      setAllTools(data);
    });
    getRoleSystemPromptTemplates().then((data) => {
      setsysPromptList(data);
    });
  }, []);

  useEffect(() => {
    if (!loading && (responseData || streamingData)) {
      if (responseData) {
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: responseData },
        ]);
      } else if (streamingData) {
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: streamingData },
        ]);
      }
    }
  }, [loading, responseData, streamingData]);

  useEffect(() => {
    console.log("debug", { conversation });
  }, [conversation]);

  useEffect(() => {
    console.log("debug", { chatHistory });
  }, [chatHistory]);
  const handleSubmit = useSubmitHandler({
    setLoading,
    setResponseData,
    setStreamingData,
    setAbortController,
  });

  const executeChatService = (values: any) => {
    const aiReplies = conversation.filter((c) => c.role === "assistant");
    console.log("debug", aiReplies);
    // const updated = [...lastAIResponse, { role: "user", content: values.userPrompt }]
    //   setConversation(updated);
    const updated = [
      ...conversation,
      { role: "user", content: values.userPrompt },
    ];
    setConversation(updated);

    const payload: ChatPayload = {
      model: values.model,
      messages: [
        { role: "system", content: getFullPrompt(values.systemPrompt) },
        ...aiReplies,
        { role: "user", content: values.userPrompt },
      ],
      temperature: values.temperature,
      stream: values.stream,
    };
    if (values.tools) {
      payload.tools = values.tools;
      payload.stream = false;
    }
    handleSubmit(payload);
  };

  console.log({ streamingData });

  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool);
    setIsModalVisible(true);
  };

  const handleAddTool = () => {
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

  React.useEffect(() => {
    const status =
      sysPromptData.systemPrompt === undefined ||
      sysPromptData.systemPrompt === "" ||
      sysPromptData.systemRole === undefined ||
      sysPromptData.systemRole === "";
    setsysPromptDisabled(status);
  }, [sysPromptData]);

  return (
    <Row className="ai__agent" gutter={24} style={{ height: "100%" }}>
      {/* Left Column - Form Section */}
      <Col
        span={11}
        style={{
          height: "calc(100% - 30px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Form
          form={form}
          onFinish={executeChatService}
          initialValues={{
            temperature: 0.8, // Set initial temperature to 0.8
            stream: true, // Set initial stream to true
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
                <Button 
                color={'primary'}
                variant="outlined"

                htmlType="submit" loading={loading}>
                  Submit
                </Button>
                <Button
                  color={'danger'}
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
              <Select
                placeholder="Select a model"
                onSelect={(value) => {
                  localStorage.setItem("selectedModel", value);
                }}
                allowClear
              >
                {models.map((model: any) => (
                  <Select.Option key={model.id} value={model.id}>
                    {model.id}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Select AI Role"
              name="systemRoleTemplate"
              rules={[]}
            >
              <Select
                style={{ width: "50%" }}
                placeholder="Select a Role"
                onSelect={(value) => {
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
                    const data = sysPromptList.find((r) => r.id === value);
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
                allowClear
                showSearch // Enable search functionality
                optionFilterProp="children" // This enables the search to filter based on option's text
              >
                <Select.Option key={`new_role`} value={"new_role"}>
                  {"New Role"}
                </Select.Option>
                {sysPromptList.map((systemRolePrompt: SystemRolePrompt) => (
                  <Select.Option
                    key={systemRolePrompt.id}
                    value={systemRolePrompt.id}
                  >
                    {systemRolePrompt.systemRole}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="AI Role"
              name="systemRole"
              rules={[
                { required: true, message: "Please input AI system role" },
              ]}
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
              rules={[
                { required: true, message: "Please input system prompt" },
              ]}
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
              rules={[
                { required: true, message: "Please input a temperature" },
              ]}
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

            <List
              size="small"
              bordered
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              style={{ maxHeight: "180px" }}
              dataSource={tools}
              renderItem={(tool) => (
                <List.Item
                  actions={[
                    <Button
                      color="danger" variant="outlined"
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => removeTool(tool)}
                    ></Button>,
                  ]}
                >
                  {tool.type} : {getFuncParamsString(tool)}
                </List.Item>
              )}
            />
            <Form.Item label="Tools" name="tools">
              <div>
                <Input
                  placeholder="Search tools"
                  prefix={<SearchOutlined />}
                  onChange={(e) => {
                    console.log(e.target.value);
                    if (e.target.value) {
                      const filtered = availableTools.filter((t) =>
                        getFuncParamsString(t).includes(e.target.value)
                      );
                      setAvailableTools(filtered);
                    } else {
                      setAvailableTools(allTools);
                    }
                  }}
                  style={{ width: "100%" }}
                />
                <List
                  pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 3,
                  }}
                  style={{ maxHeight: "180px" }}
                  dataSource={availableTools}
                  bordered
                  renderItem={(tool) => (
                    <List.Item
                      actions={[
                        <Button
                          disabled={
                            tools.findIndex(
                              (t) => t.function.name === tool.function.name
                            ) > -1
                          }
                          color="primary"
                          variant="outlined"
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => handleToolSelect(tool)}
                        ></Button>,
                      ]}
                    >
                      {tool.type} : {getFuncParamsString(tool)}
                    </List.Item>
                  )}
                />
              </div>
            </Form.Item>
          </Card>
        </Form>
        <Modal
          title="Add Tool"
          visible={isModalVisible}
          onOk={handleAddTool}
          onCancel={() => setIsModalVisible(false)}
          okText="Add Tool"
          cancelText="Cancel"
        >
          <p>
            Are you sure you want to add{" "}
            <strong>{selectedTool?.function.name}</strong> to the current form?
          </p>
        </Modal>
      </Col>

      {/* Right Column - Result Panel */}
      <Col
        span={11}
        style={{
          height: "calc(100% - 30px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ResponsePanel responseData={responseData} streamingData={streamingData} 
        setResponseData={setResponseData} setStreamingData={setStreamingData} />
      </Col>
    </Row>
  );
};

export default AIAgentUI;
