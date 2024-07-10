import "./App.css";

import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";
import { Main } from "./pages/MainPage";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { SinglePost } from "./pages/singlePostPage";
import { SingleUserPage } from "./pages/singleUserPage";
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
            <Route path="/:username" element={<SingleUserPage />} />
            <Route path="/:username/:postId" element={<SinglePost />} />
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
