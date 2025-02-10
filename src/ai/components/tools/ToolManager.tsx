import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Modal,
  Select,
  Input,
  Checkbox,
  Space,
  List,
  Empty,
} from "antd";

import "./aitool.css";
import { Tool } from "../types/tool";

const { TextArea } = Input;


const getTools= (): Tool[] => {
  const data = localStorage.getItem("aitools");
  if(data){
    return JSON.parse(data) as Tool[];
  }
  return [] as Tool[];
  
}

const ToolManager: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(getTools()||[]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log({ values });
        setTools((prevTools) => {
          const updated = [...prevTools, values];
          localStorage.setItem("aitools",JSON.stringify(updated))
          return updated;
        });
        
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{
      padding:"5px"
    }}>
      <h2>Tool List</h2>

      <Card
        extra={
          <Space>
            <Button type="primary" onClick={showModal}>
              Add New Tool
            </Button>
          </Space>
        }
      >
        {tools.length > 0 ?  tools.map((tool, index) => (
          <Card
            className="aitool__item"
            key={index}
            title={`${tool.function.name}: ${tool.type}`}
            style={{ marginBottom: 5, width: 300, height: 200 }}            
          >
            <div>
            <p>Description: {tool.function.description}</p>
            <p>Parameters:</p>
            <ul>
              {tool.function.parameters.map(p => <li> {p.name} </li>)
              }
            </ul>
            {/* <p>Parameters: {JSON.stringify(tool.function.parameters, null, 2)}</p> */}
            </div>
          </Card>
        )):<Empty /> }
      </Card>

      <Modal
        className="add__aitool"
        title="Add a New Tool"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form className="add__aitool-form" form={form} layout="vertical">
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select tool type!" }]}
          >
            <Select placeholder="Select a type">
              <Select.Option value="function">Function</Select.Option>
              {/* Add more types if needed */}
            </Select>
          </Form.Item>

          <Form.Item
            name={["function", "name"]}
            label="Function Name"
            rules={[{ required: true, message: "Please input function name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["function", "description"]}
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.List name={["function", "parameters"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ fieldKey, key, name }) => (
                  <Card key={key} style={{ marginBottom: 16 }}>
                    <h4>Parameter #{key + 1}</h4>
                    <Form.Item
                      name={[name, "name"]}
                      label="Parameter Name"
                      rules={[
                        {
                          required: true,
                          message: "Please input parameter name!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={[name, "type"]}
                      label="Parameter Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select parameter type!",
                        },
                      ]}
                    >
                      <Select placeholder="Select a type">
                        <Select.Option value="string">String</Select.Option>
                        <Select.Option value="number">Number</Select.Option>
                        {/* Add more types if needed */}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={[name, "description"]}
                      label="Parameter Description"
                      rules={[
                        {
                          required: true,
                          message: "Please input parameter description!",
                        },
                      ]}
                    >
                      <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item
                      name={[name, "required"]}
                      label="Required"
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)}>
                      Remove Parameter
                    </Button>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()}>
                    Add Parameter
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ToolManager;
