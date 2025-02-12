
# AI Agent UI

This is a React-based UI that allows users to configure and manage an AI agent, select AI models, set system prompts, input user prompts, and add tools to the agent's configuration. The application supports temperature configuration, streaming responses, and includes functionality to save system prompts for future use.

This project is built using **Vite** as the development server and bundler, offering fast build and hot-reload speeds.

## Features (Ongoing Development)

- **Model Selection**: Choose an AI model from available options.
- **System Prompt Management**: Use predefined or custom system prompts.
- **User Prompt**: Define a user prompt for interaction.
- **Tools Management**: Add tools to the agent configuration and search for tools.
- **Streaming Responses**: Enable or disable streaming of AI agent responses.
- **Prompt Saving**: Save system prompts to local storage for reuse.
- **Tool Interaction**: Select and add tools for the agent to use.
- **UI Layout**: Split layout for agent configuration and result display.

## New Features Coming Soon

- **AI Roles Page**: A new page where users can manage and configure AI roles. AI roles will help define the behavior of the agent.
- **AI Tools Page**: A new page for users to configure and manage a list of available tools. Currently, a tool for "Getting Current Weather" is implemented as an example, but additional tools will be added in the future.
- **Tool Configuration**: Users will be able to add new tools dynamically to the agent's configuration. Tools will be stored and managed separately in local storage.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sadaigm/ai-as-agent.git
```

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
cd ai-as-agent
npm install
```

### 3. Run the Development Server

Start the development server with Vite:

```bash
npm run dev
```

This will start the Vite development server, and you can view the application at `http://localhost:3000`.

### 4. Build for Production

To build the project for production, use the following command:

```bash
npm run build
```

This will create a `dist` folder with the production-ready files.

### 5. Preview the Production Build

After building the app, you can preview it locally:

```bash
npm run preview
```

## File Structure

- `src/`: Main source code folder.
  - `components/`: UI components, including the `AIAgentUI` component.
  - `hooks/`: Custom React hooks such as `useSubmitHandler` and `useModels`.
  - `utils/`: Utility functions like `getSystemPromptTemplates`, `getTools`, and `getFuncParamsString`.
  - `types/`: Type definitions for the tools and system roles.
  - `response/`: Components to handle markdown and code rendering.
  - `aiagent.css`: Styling for the AI agent UI.
  - `pages/`: New pages for managing AI roles and tools will be placed here.

## Component Overview

### `AIAgentUI`

This is the main component for the AI agent configuration UI. It handles form submission, tool selection, and response display.

- **Left Form Fields**:
  - **Model**: Select an AI model.
  - **System Role**: Define the AI's role.
  - **System Prompt**: Set the system prompt.
  - **User Prompt**: Enter the user's prompt.
  - **Temperature**: Set the response temperature (0 to 1).
  - **Stream**: Enable or disable streaming of responses.
  - **Tools**: Add tools to the agent.

- **Right Panel**: Displays the results of the agent's response in markdown format.

## AI Roles and AI Tools Pages

### AI Roles

A new **AI Roles** page will be created, allowing users to configure different AI roles. Roles help define the behavior and context of the AI agent. Users will be able to create and manage multiple roles.

- **Create and Manage AI Roles**: Users can define roles like "Assistant", "Researcher", "Advisor", etc.
- **Save Roles**: Roles will be saved to local storage for easy reuse.

### AI Tools

A new **AI Tools** page will allow users to manage a list of tools available for the AI agent to use. Currently, we have an example tool for "Getting Current Weather".

- **Add More Tools**: Users will be able to add additional tools in the future. Tools are managed separately in local storage.
- **Tool Configuration**: Each tool can have a description and specific configuration to integrate with the AI agent.

## Example Tool Implementation

As an example, a tool for getting the current weather has been implemented. This is just one of the many tools that can be added in the future.

- **Current Weather Tool**: Fetches weather information based on user input and returns it to the AI agent.

## Screenshots

- **Configuration Form**: 
  ![Configuration Form](./screenshots/configuration_form.png)

- **Response Panel**: 
  ![Streaming Response](./screenshots/streaming_response_1.png)
  ![Non Stream Agent With Tool Response](./screenshots/agent_with_tool_calls_1.png)
  ![Role Based Configuration 1](./screenshots/role_based_1.png)
  ![Role Based Configuration 2](./screenshots/role_based_2.png)
  ![Role Based Configuration 3](./screenshots/role_based_3.png)


## Dependencies

- **React**: 18.x
- **Ant Design**: 4.x
- **Vite**: 4.x (bundler and development server)
- **React Markdown**: For rendering markdown responses.
- **@ant-design/icons**: For Ant Design icons.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Ant Design for UI components.
- React Markdown for rendering markdown responses.
- Vite for fast bundling and development server.
