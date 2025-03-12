import { Routes, Route } from "react-router-dom";
import AIAgentUI from "./components/agent-ui/AIAgentUI";
import ToolPage from "./pages/ToolPage";
import SystemRolePage from "./pages/SystemRolePage";
import AiAgentList from "./pages/ai-agents/AiAgentList";
import HelpBrowser from "./components/help/HelpBrowser";
import Settings from "./pages/settings/Settings";

const AiRoutes = () => {
  return (
    <Routes>
      <Route
        path={"/"}
        element={
          <>
            <AIAgentUI />
          </>
        }
      />
      <Route
        path={"/playground-ai"}
        element={
          <>
            <AIAgentUI />
          </>
        }
      />
      <Route
        path={"/agents"}
        element={
          <>
            <AiAgentList />
          </>
        }
      />
      <Route
        path={"/tools"}
        element={
          <>
            <ToolPage />
          </>
        }
      />
      <Route
        path={"/roles"}
        element={
          <>
            <SystemRolePage />
          </>
        }
      />
      <Route
        path={"/settings-ai"}
        element={
          <>
            <Settings />
          </>
        }
      />
      <Route path="/help" element={<HelpBrowser />} />
    </Routes>
  );
};
export default AiRoutes;
