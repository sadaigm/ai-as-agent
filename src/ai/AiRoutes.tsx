import { Routes, Route } from "react-router-dom";
import AIAgentUI from "./components/AIAgentUI";
import ToolList from "./pages/ToolList";
import Roles from "./pages/Roles";


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
                <ToolList />
              </>
            }
          />
           <Route
            path={("/roles")}
            element={
              <>
                <Roles />
              </>
            }
          />
          </Routes>
    );
}
export default AiRoutes;