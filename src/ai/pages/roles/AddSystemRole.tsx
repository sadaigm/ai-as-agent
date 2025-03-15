import React, { FC, useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { ChatPayload, SystemRolePrompt } from "../../components/types/tool";
import { useSubmitHandler } from "../../hooks/useSubmitHandler";
import { getSysRolePromptTemplate } from "./role_const";
import { parseResponse } from "../../components/response/response-utils";

const { TextArea } = Input;

type AddRoleModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  saveSystemRolePrompt: (systemRolePrompt: SystemRolePrompt) => void;
  editingRole: SystemRolePrompt | null;
  setEditingRole: (role: SystemRolePrompt | null) => void;
};

const AddSystemRole: FC<AddRoleModalProps> = ({
  saveSystemRolePrompt,
  isModalVisible,
  setIsModalVisible,
  editingRole,
  setEditingRole,
}) => {
  const [form] = Form.useForm();

  const [currentRoleName, setcurrentRoleName] = useState<string|undefined>(editingRole?.systemRole||undefined);

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
    const getRoleDescription = async () => {
      console.log({ currentRoleName });
      if (!currentRoleName) {
        return;
      }
      const payload: ChatPayload = {
        model: localStorage.getItem("selectedModel") || "llama-3.2-3b-instruct",
        messages: [
          { role: "system", content: `${getSysRolePromptTemplate}` },
          {
            role: "user",
            content: `Write a role descrtion for the Role:  ${currentRoleName}, consider what unique skills this position demands. 
            Reflect on the latest tools and technologies relevant to the field. Identify key professional experiences that align with the role's challenges. 
            Emphasize soft skills that enhance teamwork and communication. 
            ${editingRole?.systemPrompt ? `The previous description was: ${editingRole.systemPrompt}` : ""}
            Lastly, pinpoint the core responsibilities and expected outcomes that define success in this position.
            Could you please provide the Summary/Description in 5 lines`,
          },
        ],
        temperature: 0.8,
        stream: false,
      };
      handleSubmit(payload);   
    };

    useEffect(() => {
        if (responseData && responseData !== null) {  
          const { parsedResponse } = parseResponse(responseData);
          if(parsedResponse){
            const strippedDescription = parsedResponse.replace(/^"|"$/g, "");
            console.log("Role Description: ", strippedDescription);
            form.setFieldsValue({ systemPrompt: strippedDescription });
          }
          
        }
      }, [responseData]);

  useEffect(() => {
    if (editingRole) {
      form.setFieldsValue(editingRole);
    } else {
      form.resetFields();
    }
  }, [editingRole, form]);

  const handleAddRole = () => {
    form
      .validateFields()
      .then((values) => {
        const newSystemRolePrompt: SystemRolePrompt = {
          id: editingRole ? editingRole.id : Math.random().toString(36).substr(2, 9), // Generate a random ID if not editing
          systemRole: values.systemRole,
          systemPrompt: values.systemPrompt,
        };
        saveSystemRolePrompt(newSystemRolePrompt);
        setIsModalVisible(false);
        form.resetFields();
        setEditingRole(null);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingRole(null);
    abortController?.abort();
  };

  return (
    <Modal
      title={editingRole ? "Edit System Role" : "Add New System Role"}
      visible={isModalVisible}
      onOk={handleAddRole}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="systemRole"
          label="System Role"
          rules={[
            { required: true, message: "Please input the system role!" },
          ]}
        >
          <Input onChange={(e) =>{
            setcurrentRoleName(e.target.value);
          }} />
        </Form.Item>
        <div style={{ marginTop: "5px" }}>
          <Button
            type="primary"
            size="small"
            disabled={loading || !currentRoleName}
            onClick={() => getRoleDescription()}
          >
            {loading ? `Generating` : `Ask for role description`}
          </Button>
        </div>
        <Form.Item
          name="systemPrompt"
          label="System Prompt"
          rules={[
            { required: true, message: "Please input the system prompt!" },
          ]}
        >
          <TextArea rows={7} placeholder="Enter system prompt" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSystemRole;
