import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./Home";
import Notepad from "./Notepad";
import Manage from "./Manage";
import Register from "./Register"
import DarkModeToggle from "./components/DarkModeToggle";
import Toast from "./components/Toast";

export default function App() {
  const darkMode = useSelector((state) => state.darkMode); // 明暗模式状态
  

  return (
    <Router>
      {/*通知 */}
      <Toast />
      {/* 背景色 */}
      <div
        className={`min-h-screen flex justify-center items-center transition-all duration-300 ${
          darkMode ? "bg-gray-900" : "bg-sky-200/40"
        }`}
      >
        {/* 主体 */}
        <div className="w-4/5 min-w-[40px] sm:w-4/5 md:w-3/5 lg:w-2/5 min-h-screen flex flex-col items-center bg-transparent">
          {/* Header Image */}
          <div
            className="w-full min-h-[30vh] max-h-[100px] bg-cover bg-top xl:bg-[top_-20px] rounded-3xl flex items-center justify-center"
            style={{
              backgroundImage: "url('https://pic.en1an.com/2025/04/02/67ed2de5472d5.jpg')",
            }}
          >
            <h1 className="text-white text-4xl font-bold leading-none">YiNiann's NAV</h1>
          </div>

          {/* 导航栏 */}
          <nav
            className={`w-full mt-4 mb-4 flex items-center bg-opacity-40 p-1 shadow-md rounded-xl transition-all duration-300 ${
              darkMode ? "bg-gray-700" : "bg-sky-500"
            }`}
          >
            <div className="flex-1 flex justify-center space-x-6">
              <Link to="/" className="text-white hover:underline">
                Home
              </Link>
              <Link to="/notepad" className="text-white hover:underline">
                Notepad
              </Link>
              <Link to="/manage" className="text-white hover:underline">
                Manage
              </Link>
            </div>

            <DarkModeToggle />
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Notepad"   element={<Notepad />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Manage />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}
