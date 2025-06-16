// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ToDoPage from "./pages/ToDoPage";

// Redirect to login if not logged in
function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/todo"
          element={
            <PrivateRoute>
              <ToDoPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
