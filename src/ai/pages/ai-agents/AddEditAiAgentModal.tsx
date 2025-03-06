import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Checkbox,
} from "antd";
import { AIAgent, Tool } from "../../components/types/tool";
import GetAIModel from "../../components/agent-ui/getAIModel";
import GetAIRoles from "../../components/agent-ui/GetAIRoles";
import GetAITools from "../../components/agent-ui/GetAITools";
import "./addai.css";

const { TextArea } = Input;

type AddEditAiAgentModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (agent: AIAgent) => void;
  agent?: AIAgent | null;
  availableTools: Tool[];
};

const AddEditAiAgentModal: React.FC<AddEditAiAgentModalProps> = ({
  visible,
  onClose,
  onSave,
  agent,
  availableTools,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (agent) {
      form.setFieldsValue(agent);
      console.log({agent})
    } else {
      form.resetFields();
    }
  }, [agent, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values as AIAgent);
        onClose();
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const onToolChange = (tools: Tool[]) => {
    console.log({tools})
    form.setFieldValue("tools", tools);
  };

  return (
    <Modal
        className="add__ai__agent-modal fullmodel"
      visible={visible}
      title={agent ? "Edit AI Agent" : "Add AI Agent"}
      onCancel={onClose}
       width="90%"
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          temperature: 0.8, // Set initial temperature to 0.8
          stream: true, // Set initial stream to true
        }}
        onValuesChange={(changedValues, allValues) => {
          console.log({ changedValues, allValues });
          // setConversation([]);
        }}
      >
        <Form.Item label="Select AI Role" name="systemRoleTemplate" rules={[]}>
          <GetAIRoles
            existingRolesOnly={true}
            onChange={(value) => {
              console.log(value);              
            }}
            onRoleChange={(role) => {
              console.log(role);
              form.setFieldsValue({
                systemPrompt: role.systemPrompt,
                name: role.systemRole,
                description: `your role:  ${role.systemRole}`,
              });
            }
            }
          />
        </Form.Item>
        <div style={{display: 'flex', width:"100%", justifyContent: 'space-between'}}>
            <div style={{width: '48%'}}>
            <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <TextArea readOnly rows={2} />
        </Form.Item>
            </div>
        
            <div style={{width: '48%'}}>
        <Form.Item
          name="systemPrompt"
          label="System Prompt"
          rules={[
            { required: true, message: "Please input the system prompt!" },
          ]}
        >
          <TextArea readOnly rows={8} />
        </Form.Item>
        </div>
        
        </div>
        <Form.Item
          label="Model"
          name="model"
          rules={[{ required: true, message: "Please select a model" }]}
        >
          <GetAIModel
            onChange={(v) => {
              console.log({ v });
              form.setFieldValue("model", v);
            }}
          />
        </Form.Item>
        <Form.Item
          name="temperature"
          label="Temperature"
          rules={[{ required: true, message: "Please input the temperature!" }]}
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
        <Form.Item label="Tools" name="tools">
          <GetAITools onChange={onToolChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditAiAgentModal;
