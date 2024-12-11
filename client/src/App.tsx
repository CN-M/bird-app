import "./App.css";

import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Bookmarks } from "./pages/Bookmarks";
import { Main } from "./pages/Main";
import { Messages } from "./pages/Messages";
import { Premium } from "./pages/Premium";
import { SingleComment } from "./pages/SingleComment";
import { SinglePost } from "./pages/SinglePost";
import { SingleReply } from "./pages/SingleReply";
import { SingleUser } from "./pages/SingleUser";
import { UserProfile } from "./pages/UserProfile";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";

function App() {
  return (
    <>
      <Router>
        {/* <div className="h-screen w-screen flex flex-col justify-between items-center space-y-4"> */}
        <div className="min-h-screen w-full flex flex-col justify-between items-center space-y-4">
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
            <Route
              path="/reply/:postId/:commentId/:replyId"
              element={<SingleReply />}
            />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Routes>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </>
  );
}

export default App;
