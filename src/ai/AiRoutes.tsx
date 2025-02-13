import { Routes, Route } from "react-router-dom";
import AIAgentUI from "./components/AIAgentUI";
import ToolPage from "./pages/ToolPage";
import SystemRolePage from "./pages/SystemRolePage";


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
            path={("/agents")}
            element={
              <>
                <AIAgentUI />
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