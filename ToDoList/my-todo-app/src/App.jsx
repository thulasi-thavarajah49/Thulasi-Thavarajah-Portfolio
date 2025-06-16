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
    //wrap app in a routing context to allow react router to track current url and control the content shown 
    <Router>

      <div className="flex items-center justify-center min-h-screen w-[100vw]">
        <div className="w-[100vw]">
          {/* Navbar */}
          <div className="navbar bg-base-100 shadow mb-6 px-4 w-full">
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-xl">My App</Link>
            </div>
            <div className="flex-none gap-2">
              <Link className="btn btn-sm btn-outline" to="/home">Home</Link>
              <Link className="btn btn-sm btn-outline" to="/login">Login</Link>
              <Link className="btn btn-sm btn-outline" to="/logout">Logout</Link>
            </div>
          </div>

          {/* Page Routes */}
          <Routes>
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
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
