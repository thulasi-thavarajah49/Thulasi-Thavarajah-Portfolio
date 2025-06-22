import "./App.css";
import { PreferencesProvider } from "../context/PreferencesContext";
import HomePage from "../home-components/HomePage";
import Register from "../home-components/RegisterPage";
import Login from "../home-components/LoginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}>
        <PreferencesProvider>
          <HomePage />
        </PreferencesProvider>
      </RouterProvider>
    </>
  );
}

export default App;
