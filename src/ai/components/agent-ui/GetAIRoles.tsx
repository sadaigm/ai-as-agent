import { Select } from "antd";
import React, { FC, useEffect, useState } from "react";
import { SystemRolePrompt } from "../types/tool";
import { getSystemPromptTemplates as getRoleSystemPromptTemplates } from "../../utils/service";

type GetAIRolesProps = {
  existingRolesOnly?: boolean;
  onChange: (value: string) => void;
  onRoleChange?: (systemRolePrompt: SystemRolePrompt) => void;
};

const GetAIRoles: FC<GetAIRolesProps> = ({
  onChange,
  existingRolesOnly,
  onRoleChange,
}) => {
  const [sysPromptList, setsysPromptList] = useState<SystemRolePrompt[]>([]);
  useEffect(() => {
    getRoleSystemPromptTemplates().then((data) => {
      setsysPromptList(data);
    });
  }, []);
  const getRoles = sysPromptList.map(
    (systemRolePrompt: SystemRolePrompt, index) => {
      return {
        value: `${systemRolePrompt.id}`,
        label: `${systemRolePrompt.systemRole}`,
      };
    }
  );
  const updatedRoles = [
    {
      value: "new_role",
      label: "New Role",
    },
    ...getRoles,
  ];

  const onChanged = (value: string) => {
    onChange(value);
    if (value !== "new_role") {
      const data = sysPromptList.find((r) => `${r.id}` === `${value}`);
      if (data) {
        console.log({ data });
        onRoleChange && onRoleChange(data);
      }
    } else {
      onRoleChange &&
        onRoleChange({
          id: "",
          systemPrompt: "",
          systemRole: "",
        });
    }
  };

  return (
    <Select
      style={{ width: "50%" }}
      placeholder="Select a Role"
      onChange={onChanged}
      options={existingRolesOnly ? getRoles : updatedRoles}
      allowClear
      showSearch // Enable search functionality
      optionFilterProp="children"
    />
  );
};

export default GetAIRoles;
