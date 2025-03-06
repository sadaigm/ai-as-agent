import { Routes, Route } from "react-router-dom";
import AIAgentUI from "./components/agent-ui/AIAgentUI";
import ToolPage from "./pages/ToolPage";
import SystemRolePage from "./pages/SystemRolePage";
import AiAgentList from "./pages/ai-agents/AiAgentList";


const AiRoutes = () => {
    return (
        <Routes>
            <Route
            path={("/")}
            element={
              <>
                <AIAgentUI />
              </>
            }
          />
          <Route
            path={("/playground-ai")}
            element={
              <>
                <AIAgentUI />
              </>
            }
          />
          <Route
            path={("/agents")}
            element={
              <>
                <AiAgentList />
              </>
            }
          />
          <Route
            path={("/tools")}
            element={
              <>
                <ToolPage />
              </>
            }
          />
           <Route
            path={("/roles")}
            element={
              <>
                <SystemRolePage />
              </>
            }
          />
          </Routes>
    );
}
export default AiRoutes;