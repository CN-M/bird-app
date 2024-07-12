import "./App.css";

import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Main } from "./pages/Main";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { SingleComment } from "./pages/singleComment";
import { SinglePost } from "./pages/singlePost";
import { SingleUser } from "./pages/singleUser";
import { UserProfile } from "./pages/userProfile";

function App() {
  return (
    <>
      <Router>
        <div className="h-screen w-full flex flex-col justify-between items-center space-y-4">
          <Navbar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/:username" element={<SingleUser />} />
            <Route path="/:username/:postId" element={<SinglePost />} />
            <Route
              path="/comment/:postId/:commentId"
              element={<SingleComment />}
            />
            <Route path="/:username/profile" element={<UserProfile />} />
          </Routes>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </>
  );
}

export default App;
