export const helpContent: any = {
  "playground-ai": {
    title: "AI Playground",
    content: `
The AI Playground is the main component for configuring and interacting with AI agents. The goal of this page is to allow users to set up and test AI agents by providing various inputs and configurations.

### Objective

The objective of the AI Playground is to enable users to configure AI agents, provide prompts, and receive responses in real-time.

### Steps to Use

1. **Navigate to AI Playground**:
   - Click on the side navigation menu item labeled "AI Playground".

2. **Model Selection**:
   - Choose an AI model from the available options.
   - The model defines the underlying AI that will process the prompts and generate responses.

3. **System Role**:
   - Define the AI's role by selecting a predefined role or creating a custom role.
   - The role helps guide the AI's behavior and responses.

4. **System Prompt**:
   - Set the system prompt to provide context or instructions to the AI.
   - This prompt helps the AI understand the context and generate relevant responses.

5. **User Prompt**:
   - Enter the user's prompt or question that you want the AI to respond to.
   - This is the main input that the AI will process to generate a response.

6. **Temperature**:
   - Set the response temperature (0 to 1).
   - A lower temperature results in more deterministic responses, while a higher temperature results in more random responses.

7. **Stream**:
   - Enable or disable streaming of responses.
   - Streaming allows users to receive responses in real-time as the AI generates them.

8. **Tools**:
   - Add tools to the agent to extend its functionality.
   - Tools can be used to fetch external data or perform specific actions.

9. **Submit**:
   - Click on the "Submit" button to send the prompts to the AI agent and receive a response.

### Right Panel

The right panel displays the results of the AI agent's response in markdown format. Users can see the AI's response based on the provided inputs and configurations.
    `,
  },
  roles: {
    title: "AI Roles",
    content: `
The AI Roles page allows users to configure different AI roles. The goal of this page is to define the behavior and context of the AI agent by creating and managing roles.

### Objective

The objective of the AI Roles page is to enable users to create, manage, and delete roles that define the AI agent's behavior and context.

### Steps to Use

1. **Navigate to AI Roles**:
   - Click on the side navigation menu item labeled "AI Roles".

2. **Create Roles**:
   - Click on the "Add Role" button to create a new role.
   - Define the role by providing a name and description.
   - Save the role to add it to the list of available roles.

3. **Manage Roles**:
   - View the list of existing roles.
   - Click on a role to edit its details.
   - Update the role's name and description as needed.
   - Save the changes to update the role.

4. **Delete Roles**:
   - Select a role from the list.
   - Click on the "Delete" button to remove the role from the list.
   - Confirm the deletion to permanently remove the role.

### Save Roles

Roles will be saved to local storage for easy reuse. Users can quickly access and apply predefined roles to their AI agents.
    `,
  },
  tools: {
    title: "AI Tools",
    content: `
The AI Tools page allows users to manage a list of tools available for the AI agent to use. The goal of this page is to extend the functionality of AI agents by integrating external tools.

### Objective

The objective of the AI Tools page is to enable users to add, configure, and manage tools that enhance the capabilities of AI agents.

### Steps to Use

1. **Navigate to AI Tools**:
   - Click on the side navigation menu item labeled "AI Tools".

2. **Add Tools**:
   - Click on the "Add Tool" button to create a new tool.
   - Provide a name and description for the tool.
   - Configure the tool by setting its parameters and actions.
   - Save the tool to add it to the list of available tools.

3. **Manage Tools**:
   - View the list of existing tools.
   - Click on a tool to edit its details.
   - Update the tool's name, description, and configuration as needed.
   - Save the changes to update the tool.

4. **Delete Tools**:
   - Select a tool from the list.
   - Click on the "Delete" button to remove the tool from the list.
   - Confirm the deletion to permanently remove the tool.

### Tool Configuration

Each tool can have a description and specific configuration to integrate with the AI agent. Users can define the tool's parameters, actions, and behavior.

### Example Tool Implementation

As an example, a tool for getting the current weather has been implemented. This tool fetches weather information based on user input and returns it to the AI agent. Users can add similar tools to extend the AI agent's functionality.

### REST API Tool

In addition to predefined tools, users can add any REST API as a tool for the AI agent. This feature opens up numerous use cases, allowing the AI agent to interact with various external systems and services.

#### Benefits of REST API Tool

- **Versatility**: The AI agent can be integrated with any domain-specific API, such as School Management, Supply Chain, etc.
- **Automation**: Automate tasks and scenarios by leveraging external APIs.
- **Scalability**: Extend the AI agent's capabilities to handle a wide range of use cases.

### Import API from Swagger Config JSON

Users can import API configurations from a Swagger JSON file. This feature allows users to select any GET API from the Swagger documentation and add it to the tools.

#### Steps to Import API

1. **Upload Swagger JSON**:
   - Users can upload a Swagger JSON file that contains the API documentation.

2. **Select GET API**:
   - From the uploaded Swagger file, users can browse and select any available GET API.

3. **Configure API Tool**:
   - Once selected, users can configure the API tool by setting the endpoint, request method, headers, and parameters.

4. **Add to Tools**:
   - After configuration, the API tool can be added to the list of available tools for the AI agent.
    `,
  },
  agents: {
    title: "AI Agents",
    content: `
The AI Agents page allows users to create multiple agents and view the list of available agents. The goal of this page is to manage the lifecycle of AI agents, including creation, configuration, and deletion.

### Objective

The objective of the AI Agents page is to enable users to create, view, edit, and delete AI agents.

### Steps to Use

1. **Navigate to AI Agents**:
   - Click on the side navigation menu item labeled "AI Agents".

2. **Create Agents**:
   - Click on the "Add Agent" button to create a new agent.
   - Provide a name and description for the agent.
   - Configure the agent by selecting a model, role, and tools.
   - Save the agent to add it to the list of available agents.

3. **View Agents**:
   - View the list of existing agents.
   - Click on an agent to see its details and configuration.

4. **Edit Agents**:
   - Select an agent from the list.
   - Click on the "Edit" button to update the agent's details and configuration.
   - Save the changes to update the agent.

5. **Delete Agents**:
   - Select an agent from the list.
   - Click on the "Delete" button to remove the agent from the list.
   - Confirm the deletion to permanently remove the agent.

### Multiple Agents Management

Users can create multiple agents and manage them efficiently using the AI Agents page. This allows users to handle various tasks and scenarios by configuring different agents.
    `,
  },
  "settings-ai": {
    title: "Settings",
    content: `
The Settings page allows users to add, edit, and delete environments of type AI or Tool (REST API details). This helps users configure API keys or tool headers to authorize APIs.

### Objective

The objective of the Settings page is to enable users to manage environments that define the configuration for AI or Tool integrations.

### Steps to Use

1. **Navigate to Settings**:
   - Click on the side navigation menu item labeled "Settings".

2. **Add Environment**:
   - Click on the "Add Environment" button to create a new environment.
   - Provide a name, host URL, and type (AI or Tool) for the environment.
   - Configure the environment by setting headers (key-value pairs) for API authorization.
   - Save the environment to add it to the list of available environments.

3. **Edit Environment**:
   - View the list of existing environments.
   - Click on the "Edit" button next to an environment to update its details.
   - Update the environment's name, host URL, type, and headers as needed.
   - Save the changes to update the environment.

4. **Delete Environment**:
   - Select an environment from the list.
   - Click on the "Delete" button to remove the environment from the list.
   - Confirm the deletion to permanently remove the environment.

### Environment Configuration

Each environment can have a name, host URL, type (AI or Tool), and headers (key-value pairs) for API authorization. Users can define the environment's parameters to integrate with AI or external tools.

### Example Environment Configuration

As an example, an environment for an AI service can be configured with the following details:
- **Name**: My AI Service
- **Host URL**: https://api.myaiservice.com
- **Type**: AI
- **Headers**: 
  - **API-Key**: abc123
  - **Authorization**: Bearer token

Users can add similar environments to configure different AI services or tools for their AI agents.
    `,
  },
};