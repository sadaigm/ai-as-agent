import { Select } from "antd";
import React, { FC, useEffect, useState } from "react";
import { SystemRolePrompt } from "../types/tool";
import { getSystemPromptTemplates as getRoleSystemPromptTemplates } from "../../utils/service";

type GetAIRolesProps = {
  defaultValue?: string;
  existingRolesOnly?: boolean;
  onChange: (value: string) => void;
  onRoleChange?: (systemRolePrompt: SystemRolePrompt) => void;
};

const GetAIRoles: FC<GetAIRolesProps> = ({
  onChange,
  existingRolesOnly,
  onRoleChange,
  defaultValue,
}) => {
  const [sysPromptList, setsysPromptList] = useState<SystemRolePrompt[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<{ value: string; label: string; }[]>([]);

  useEffect(() => {
    getRoleSystemPromptTemplates().then((data) => {
      setsysPromptList(data);
      setFilteredRoles(fetchRoleOptions(data));
    });
  }, []);

  const getRoles = (data: SystemRolePrompt[]) => data.map(
    (systemRolePrompt: SystemRolePrompt) => {
      return {
        value: `${systemRolePrompt.id}`,
        label: `${systemRolePrompt.systemRole}`,
      };
    }
  );

  const fetchRoleOptions = (data: SystemRolePrompt[]): { value: string; label: string; }[] => {
    const roles = getRoles(data);
    return existingRolesOnly ? roles : [{ value: "new_role", label: "New Role" }, ...roles];
  };

  const onChanged = (value: string) => {
    onChange(value);
    if (value !== "new_role") {
      const data = sysPromptList.find((r) => `${r.id}` === value);
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

  const onSearch = (value: string) => {
    const filtered = fetchRoleOptions(sysPromptList).filter(role =>
      role.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoles(filtered);
  };

  return (
    <Select
      defaultValue={defaultValue}
      style={{ width: "50%" }}
      placeholder="Select a Role"
      onChange={onChanged}
      options={filteredRoles}
      allowClear
      onSearch={onSearch}
      showSearch // Enable search functionality
      filterOption={false} // Disable built-in filtering to use custom onSearch
    />
  );
};

export default GetAIRoles;
