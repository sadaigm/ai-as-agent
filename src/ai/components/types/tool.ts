export interface SystemRolePrompt {
    id: string;
    systemRole: string;
    systemPrompt: string;
}

export interface Parameter {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }
  
  export interface Tool {
    type: string;
    function: {
      name: string;
      description: string;
      parameters: Parameter[];
    };
  }