import { Space, Input, Card, Button, Empty, Tooltip, Form } from "antd";
import { DeleteOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { FC, useState, useEffect } from "react";

type WorkflowDetailsProps = {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  globalVariables: Record<string, string>;
  setGlobalVariables: (variables: Record<string, string>) => void;
};

const WorkflowDetails: FC<WorkflowDetailsProps> = ({
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  globalVariables,
  setGlobalVariables,
}) => {
  const [form] = Form.useForm(); // Create a form instance
  const [editKey, setEditKey] = useState<string | null>(null); // Track the key being edited
  const [editedKey, setEditedKey] = useState<string>(""); // Track the edited key
  const [editedValue, setEditedValue] = useState<string>(""); // Track the edited value

  useEffect(() => {
    // Update form values when workflowName or workflowDescription changes
    form.setFieldsValue({ workflowName, workflowDescription });
  }, [workflowName, workflowDescription, form]);

  const handleSave = (originalKey: string) => {
    const updatedVariables = { ...globalVariables };

    // If the key was changed, update the key in the globalVariables object
    if (editedKey !== originalKey) {
      delete updatedVariables[originalKey];
    }

    updatedVariables[editedKey] = editedValue;
    setGlobalVariables(updatedVariables); // Save the updated variables
    setEditKey(null); // Exit edit mode
    setEditedKey(""); // Clear the temporary key state
    setEditedValue(""); // Clear the temporary value state
  };

  const handleAddVariable = () => {
    const newKey = `newKey${Object.keys(globalVariables).length}`;
    setGlobalVariables({
      ...globalVariables,
      [newKey]: "",
    });
    setEditKey(newKey); // Set the new key as the one being edited
    setEditedKey(newKey); // Initialize the edited key state
    setEditedValue(""); // Initialize the edited value state
  };

  return (
    <div style={{ display: "flex", height: "100%", width: "100%", padding: "10px", overflowY:"auto" }}>
      <Space direction="vertical" style={{ width: "100%", flex: 1}}>
        {/* Workflow Name and Description */}
        <Form
          form={form} // Bind the form instance
          layout="vertical"
          initialValues={{ workflowName, workflowDescription }}
          onValuesChange={(changedValues) => {
            if (changedValues.workflowName !== undefined) {
              setWorkflowName(changedValues.workflowName);
            }
            if (changedValues.workflowDescription !== undefined) {
              setWorkflowDescription(changedValues.workflowDescription);
            }
          }}
        >
          <Form.Item
            label="Workflow Name"
            name="workflowName"
            rules={[
              { required: true, message: "Workflow Name is required." },
              { min: 4, message: "Workflow Name must be at least 4 characters long." },
            ]}
          >
            <Input placeholder="Workflow Name" />
          </Form.Item>
          <Form.Item label="Workflow Description" name="workflowDescription">
            <Input.TextArea placeholder="Workflow Description" rows={4} />
          </Form.Item>
        </Form>

        {/* Global Variables Card */}
        <Card
          title="Global Variables"
          extra={
            <Button type="primary" onClick={handleAddVariable}>
              Add Variable
            </Button>
          }
        >
          {Object.entries(globalVariables).length > 0 ? (
            Object.entries(globalVariables).map(([key, value], index) => (
              <Space
                key={index}
                style={{
                  display: "flex",
                  marginBottom: 8,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Input
                  placeholder="Key"
                  value={editKey === key ? editedKey : key} // Show edited key if in edit mode
                  disabled={editKey !== key} // Disable unless editing
                  onChange={(e) => setEditedKey(e.target.value)} // Update temporary key state
                  style={{ flex: 1 }}
                />
                <Input
                  placeholder="Value"
                  value={editKey === key ? editedValue : value} // Show edited value if in edit mode
                  disabled={editKey !== key} // Disable unless editing
                  onChange={(e) => setEditedValue(e.target.value)} // Update temporary value state
                  style={{ flex: 2 }}
                />
                {editKey === key ? (
                  <Tooltip title="Save">
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => handleSave(key)} // Save changes
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Edit">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditKey(key); // Enter edit mode
                        setEditedKey(key); // Set the current key in temporary state
                        setEditedValue(value); // Set the current value in temporary state
                      }}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Delete">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const updatedVariables = { ...globalVariables };
                      delete updatedVariables[key];
                      setGlobalVariables(updatedVariables); // Remove the variable
                    }}
                  />
                </Tooltip>
              </Space>
            ))
          ) : (
            <Empty
              description="No global variables added yet."
              style={{ textAlign: "center" }}
            />
          )}
        </Card>
      </Space>
    </div>
  );
};

export default WorkflowDetails;