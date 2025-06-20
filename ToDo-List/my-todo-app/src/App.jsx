import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import ProtectedRoute from "./pages/ProtectedRoute";
import "./index.css";
import { PreferencesContext,PreferencesProvider } from "./context/PreferencesContext";


function App() {
  return (
     <PreferencesProvider>
    <Router>

      <div className="flex items-center justify-center min-h-screen w-[100vw]">
        <div className="w-[100vw]">
          {/* Page Routes */}
          <Routes>
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
    </PreferencesProvider>
  );
}

export default App;
