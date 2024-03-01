import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/signUp";
import LoginPage from "./pages/login";
import "./App.css";
import ProtectedPage from "./pages/protected";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/protected" element={<ProtectedPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
