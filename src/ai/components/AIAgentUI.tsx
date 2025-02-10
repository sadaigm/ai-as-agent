import React, { useState, useEffect } from "react";
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
import { SearchOutlined } from "@ant-design/icons";
import "./aiagent.css";
import { streamData } from "./mock";
import { getSystemPromptTemplates, getTools } from "../utils/service";
import { getFuncParamsString } from "../utils/function";
import { SystemRolePrompt, Tool } from "./types/tool";
import ReactMarkdown from "react-markdown";
import CodeBlock , {PreBlock} from "./response/CodeBlock";

const { TextArea } = Input;

const ToolList = getTools();

const apiBase: string = "http://127.0.0.1:11434/v1/";

const AIAgentUI = () => {
  const [form] = Form.useForm();
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null); // Store API response
  const [streamingData, setStreamingData] = useState(""); // Store streamed data
  const [models, setModels] = useState([]); // Store list of models
  const [sysPromptDisabled, setsysPromptDisabled] = useState(true);
  const [sysPromptData, setsysPromptData] = useState<SystemRolePrompt>(
    {} as SystemRolePrompt
  );
  const [sysPromptList, setsysPromptList] = useState<SystemRolePrompt[]>(
    getSystemPromptTemplates() || []
  );

  const [availableTools, setAvailableTools] = React.useState(ToolList);
  const [abortController, setAbortController] = useState<AbortController | null>(null); // Keep track of the AbortController

  // Fetch the list of models from the API when the component mounts
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(apiBase + "models");
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

  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool);
    setIsModalVisible(true);
  };

  const handleAddTool = () => {
    if (selectedTool) {
      setTools([...tools, selectedTool]);
      console.log({selectedTool},`${selectedTool.type}:${selectedTool.function.name} added to tools list`)
      message.success(`${selectedTool.type}:${selectedTool.function.name} added to tools list`);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort(); // Abort the fetch request if in progress
      message.warning("Request was canceled");
      setLoading(false); // Stop loading
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setResponseData(null);
    setStreamingData("");
    
    const controller = new AbortController(); // Create a new AbortController instance
    setAbortController(controller); // Set the controller to be able to abort later

    const payload = {
      model: values.model,
      messages: [
        { role: "system", content: values.systemPrompt },
        { role: "user", content: values.userPrompt },
      ],
      temperature: values.temperature,
      stream: values.stream,
    };

    try {
      const response = await fetch(apiBase + "chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal, // Attach the signal to the fetch request
      });

      if (!response.ok) {
        throw new Error("Failed to send request");
      }

      if (values.stream) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let text = ""; // Accumulate the chunks of data

        while (!done) {
          const { value, done: readerDone } = (await reader?.read()) || {};
          done = readerDone || false;

          if (controller.signal.aborted) {
            break; // If the request is aborted, stop the stream
          }

          if (value) {
            text += decoder.decode(value, { stream: true });

            const chunks = text.split("data: ");
            let chunk = chunks[1];

            if (chunk.trim()) {
              try {
                const formattedJSON = JSON.parse(chunk);

                if (
                  formattedJSON?.choices &&
                  formattedJSON.choices[0]?.delta?.content
                ) {
                  setStreamingData((prevData) =>
                    prevData + formattedJSON.choices[0].delta.content
                  );
                }
              } catch (error) {
                console.log("Waiting for valid JSON...");
              }
            }

            text = chunks[chunks.length - 1];
          }
        }

        message.success("Streaming completed");
      } else {
        const data = await response.json();
         // Store response in state if not streaming
        if (
          data?.choices && 
          data.choices[0].finish_reason==='stop'
          && data.choices[0]?.message?.content 
          && data.choices[0]?.message?.role === "assistant"
        ) {
          console.log({data})
          setResponseData(data.choices[0]?.message?.content);
        }
        
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request was canceled");
      } else {
        message.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
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
            onFinish={handleSubmit}
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
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button
              type="default"
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
              <Select placeholder="Select a model" allowClear>
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
                  if (value !== "new_role") {
                    const data = getSystemPromptTemplates().find(
                      (r) => r.id === value
                    );
                    if (data) {
                      console.log({ data });
                      setsysPromptData(data);
                      form.setFieldValue("systemPrompt", data.systemPrompt);
                      form.setFieldValue("systemRole", data.systemRole);
                    }
                  } else {
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
                type="primary"
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
              style={{maxHeight:'180px'}}
              dataSource={tools}
              renderItem={(tool) => (
                <List.Item>
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
                      setAvailableTools(ToolList);
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
                style={{maxHeight:'180px'}}
                  dataSource={availableTools}
                  bordered
                  renderItem={(tool) => (
                    <List.Item
                      actions={[
                        <Button
                         disabled={tools.findIndex(t => t.function.name === tool.function.name)>-1}
                          type="primary"
                          size="small"
                          onClick={() => handleToolSelect(tool)}
                        >
                          Add
                        </Button>,
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
              <strong>{selectedTool?.function.name}</strong> to the current
              form?
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
        <Card
          className="agent__result"
          title="Result"
          bordered={false}
          style={{ flex: 1 }}
          extra={
            <Space>
              <Button onClick={() => {
                setResponseData(null);
                setStreamingData("");

              }}>Clear</Button>
            </Space>
          }
        >
          {streamingData ? (
            <>
            <ReactMarkdown
            components={{
              pre: PreBlock,
              code: CodeBlock
            }}
            
            children={streamingData} />
            {/* <pre
              style={{
                height: "calc(100% - 40px)",
                display: "flex",
                overflowY: "auto",
              }}
              >
              <code style={{ whiteSpace: "break-spaces" }}>
                {streamingData}
              </code>
            </pre> */}
              </>
          ) : responseData ? (
            <>
            <ReactMarkdown 
            components={{
              code: PreBlock,
            }
            }
            children={responseData} />
            {/* <pre>{JSON.stringify(responseData, null, 2)}</pre> */}
            </>
          ) : (
            // <Typography.Text>
            //   No response data yet. Submit a request to get results.
            // </Typography.Text>
            <Empty />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default AIAgentUI;
