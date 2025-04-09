import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/SignUp";
import MainPage from "./pages/Mainpage";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;