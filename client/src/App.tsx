import "./App.css";

import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
  return (
    <>
      <Router>
        <div className="h-screen w-full flex flex-col justify-between items-center space-y-4">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </>
  );
}

export default App;
