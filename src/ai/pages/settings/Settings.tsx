import React, { CSSProperties, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Collapse,
  CollapseProps,
  Descriptions,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CaretRightOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useEnvironment } from "../../hooks/useEnvironment";
import { Environment } from "../../components/types/environment";
import { getDefaultAI, saveDefaultAI } from "../../utils/service";

const { TextArea } = Input;

const Settings: React.FC = () => {
  const { environments, saveEnvironment, deleteEnvironment } = useEnvironment();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] =
    useState<Environment | null>(null);
  const [form] = Form.useForm();
  const [defaultAIEnv, setdefaultAIEnv] = useState(getDefaultAI());

  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsEditMode(false);
    setCurrentEnvironment(null);
  };

  const handleAddEnvironment = (values: any) => {
    const newEnvironment = {
      id: Math.random().toString(36).substr(2, 9),
      name: values.name,
      hostUrl: values.hostUrl,
      appBasePath: values.appBasePath||"",
      type: values.type,
      headers: values.headers || [],
    };
    saveEnvironment(newEnvironment);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditEnvironment = (values: any) => {
    if (!currentEnvironment) return;
    const updatedEnvironment = {
      ...currentEnvironment,
      id: currentEnvironment?.id,
      name: values.name,
      hostUrl: values.hostUrl,
      appBasePath: values.appBasePath||"",
      type: values.type,
      headers: values.headers || [],
    };
    if(defaultAIEnv?.id === currentEnvironment.id){
      saveDefaultAI(updatedEnvironment);
      setdefaultAIEnv(updatedEnvironment);      
    }
    saveEnvironment(updatedEnvironment);
    setIsModalVisible(false);
    form.resetFields();
    setIsEditMode(false);
    setCurrentEnvironment(null);
  };

  const getExtra = (item: Environment) => {
    return (
      <Space>
        {defaultAIEnv?.id !== item.id && item.type.toUpperCase() === "AI" && (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={(e) => {
              saveDefaultAI(item);
              setdefaultAIEnv(item);
              e.stopPropagation();
            }}
          >
            Set as Default AI
          </Button>
        )}
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={(e) => {
            setIsEditMode(true);
            setCurrentEnvironment(item);
            form.setFieldsValue(item);
            showModal();
            e.stopPropagation();
          }}
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            Modal.confirm({
              title: "Are you sure you want to delete this environment?",
              onOk: () => {
                deleteEnvironment(item.name);
              },
            });
            e.stopPropagation();
          }}
        />
      </Space>
    );
  };

  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) => {
    return environments.map((env, index) => ({
      key: env.name + index,
      label: (
        <>
          <Space direction="horizontal">
            <span style={{ marginRight: "5px" }}>{`${env.name}`}</span>
            {env.type === "AI" ? (
              <ThunderboltOutlined style={{ color: "#FF5722" }} />
            ) : (
              <ApiOutlined style={{ color: "#03A9F4" }} />
            )}
            {defaultAIEnv?.id === env.id && (
              <Tag color="#87d068" icon={<CheckOutlined />}>
                Default AI
              </Tag>
            )}
          </Space>
        </>
      ),
      extra: getExtra(env),
      children: (
        <div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Host URL">
              {env.hostUrl}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {env.type === "AI" ? (
                <ThunderboltOutlined style={{ color: "#FF5722" }} />
              ) : (
                <ApiOutlined style={{ color: "#03A9F4" }} />
              )}
              <span style={{ marginLeft: "5px" }}>{`${env.type}`}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Headers">
              <ul>
                {env.headers.map((header) => (
                  <li key={header.key}>
                    <Typography.Text strong>{header.key}:</Typography.Text>{" "}
                    {header.value}
                  </li>
                ))}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
      style: panelStyle,
    }));
  };

  return (
    <div>
      <Card
        title="Environment Settings"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add Environment
          </Button>
        }
      >
        {environments.length > 0 ? (
          <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{ background: token.colorBgContainer }}
            items={getItems(panelStyle)}
          />
        ) : (
          <Empty description="No environments found" />
        )}
      </Card>
      <Modal
        title={isEditMode ? "Edit Environment" : "Add Environment"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={isEditMode ? handleEditEnvironment : handleAddEnvironment}
          layout="vertical"
        >
          <Form.Item
            label="Environment Name"
            name="name"
            rules={[
              { required: true, message: "Please input the environment name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Host URL"
            name="hostUrl"
            rules={[
              { required: true, message: "Please input the host URL!" },
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
            label="App Base Path"
            name="appBasePath"
            rules={[
              { required: true, message: "Please input the App Base Path!" },
              { type: "string", message: "Please enter a valid App Base Path" },
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
          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message: "Please select the environment type!",
              },
            ]}
          >
            <Select placeholder="Select environment type">
              <Select.Option value="AI">AI</Select.Option>
              <Select.Option value="Tool">Tool</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Customer Header Params" name="headers">
            <Form.List name="headers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "key"]}
                        fieldKey={[fieldKey ?? 0, "key"]}
                        rules={[{ required: true, message: "Missing key" }]}
                      >
                        <Input placeholder="Key" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        fieldKey={[fieldKey ?? 0, "value"]}
                        rules={[{ required: true, message: "Missing value" }]}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Header
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditMode ? "Update Environment" : "Add Environment"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
