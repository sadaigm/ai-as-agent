import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  List,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface Environment {
  name: string;
  hostUrl: string;
  type: string;
  headers: { key: string; value: string }[];
}

const Settings: React.FC = () => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddEnvironment = (values: any) => {
    const newEnvironment: Environment = {
      name: values.name,
      hostUrl: values.hostUrl,
      type: values.type,
      headers: values.headers || [],
    };
    setEnvironments([...environments, newEnvironment]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const removeEnvironment = (name: string) => {
    setEnvironments(environments.filter((env) => env.name !== name));
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
        <List
          dataSource={environments}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => removeEnvironment(item.name)}
                />,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`Type: ${item.type}, Host URL: ${item.hostUrl}`}
              />
            </List.Item>
          )}
        />
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
            rules={[{ required: true, message: "Please input the environment name!" }]}
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
            rules={[{ required: true, message: "Please select the environment type!" }]}
          >
            <Select placeholder="Select environment type">
              <Select.Option value="AI">AI</Select.Option>
              <Select.Option value="Tools">Tools</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Customer Header Params"
            name="headers"
          >
            <Form.List name="headers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'key']}
                        fieldKey={[fieldKey ?? 0, 'key']}
                        rules={[{ required: true, message: 'Missing key' }]}
                      >
                        <Input placeholder="Key" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        fieldKey={[fieldKey ?? 0, 'value']}
                        rules={[{ required: true, message: 'Missing value' }]}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>
                      <Button type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
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