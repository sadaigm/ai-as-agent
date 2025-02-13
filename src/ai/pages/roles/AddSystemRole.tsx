import React, { FC, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { SystemRolePrompt } from "../../components/types/tool";

const { TextArea } = Input;

type AddRoleModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  saveSystemRolePrompt: (systemRolePrompt: SystemRolePrompt) => void;
};

const AddSystemRole: FC<AddRoleModalProps> = ({
  saveSystemRolePrompt,
  isModalVisible,
  setIsModalVisible,
}) => {
  const [form] = Form.useForm();

  const handleAddRole = () => {
    form
      .validateFields()
      .then((values) => {
        const newSystemRolePrompt: SystemRolePrompt = {
          id: Math.random().toString(36).substr(2, 9), // Generate a random ID
          systemRole: values.systemRole,
          systemPrompt: values.systemPrompt,
        };
        saveSystemRolePrompt(newSystemRolePrompt);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New System Role"
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
          <Input />
        </Form.Item>
        <Form.Item
          name="systemPrompt"
          label="System Prompt"
          rules={[
            { required: true, message: "Please input the system prompt!" },
          ]}
        >
          <TextArea  rows={4} placeholder="Enter system prompt" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSystemRole;
