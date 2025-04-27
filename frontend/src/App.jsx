import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/SignUp";
import MainPage from "./pages/Mainpage";
import ProtectedRoute from "./component/ProtectedRoute";
import Home from "./pages/Home";
import BatchForm from "./pages/BatchDownload";
import CertificateForm from "./pages/CertificateDownload";
import Viewall from "./pages/viewall";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 

        <Route element={<ProtectedRoute />}>
        <Route path="/downloadcertificate" element={<CertificateForm />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/downloadbatch" element={<BatchForm />} />
          <Route path="/viewall" element={<Viewall/>}/>
          {/* <Route path="/" element={<MainPage />} /> */}
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;