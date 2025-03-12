import React, { CSSProperties, useState } from "react";
import {
  Button,
  Card,
  Collapse,
  CollapseProps,
  Descriptions,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Select,
  Space,
  theme,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CaretRightOutlined,
  ApiOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useEnvironment } from "../../hooks/useEnvironment";
import { Environment } from "../../components/types/environment";

const { TextArea } = Input;

const Settings: React.FC = () => {
  const { environments, saveEnvironment, deleteEnvironment } = useEnvironment();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

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
  };

  const handleAddEnvironment = (values: any) => {
    const newEnvironment = {
      name: values.name,
      hostUrl: values.hostUrl,
      type: values.type,
      headers: values.headers || [],
    };
    saveEnvironment(newEnvironment);
    setIsModalVisible(false);
    form.resetFields();
  };

  const getExtra = (item: Environment) => {
    return (
      <Button
        type="text"
        icon={<DeleteOutlined />}
        onClick={() => deleteEnvironment(item.name)}
      />
    );
  };

  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) => {
    return environments.map((env, index) => ({
      key: env.name + index,
      label: (
        <>
          <span style={{ marginRight:'5px'}}>{`${env.name}`}</span>
          {env.type === "AI" ? <ThunderboltOutlined style={{color:"#FF5722"}} /> : <ApiOutlined style={{ color: "#03A9F4"}} />}
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
            {env.type === "AI" ? <ThunderboltOutlined style={{color:"#FF5722"}} /> : <ApiOutlined style={{ color: "#03A9F4"}} />}
            <span style={{ marginLeft:'5px'}}>{`${env.name}`}</span>
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
        {/* <List
          dataSource={environments}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => deleteEnvironment(item.name)}
                />,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`Type: ${item.type}, Host URL: ${item.hostUrl}`}
              />
            </List.Item>
          )}
        /> */}
      </Card>
      <Modal
        title="Add Environment"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddEnvironment} layout="vertical">
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
            rules={[{ required: true, message: "Please input the host URL!" }]}
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
              <Select.Option value="Tools">Tools</Select.Option>
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
              Add Environment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
