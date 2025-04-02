import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Home from "./Home"
import Notepad from "./Notepad"
import Manage from "./Manage"
import DarkModeToggle from "./components/DarkModeToggle"
import Toast from "./components/Toast"
import { useState } from "react"

export default function App() {
  const darkMode = useSelector((state) => state.darkMode) //明暗状态
  const [isDragDeleteEnabled, setIsDragDeleteEnabled] = useState(false)//sort状态

  const toggleSort = () => {
    setIsDragDeleteEnabled(!isDragDeleteEnabled); //切换sort事件处理
  }

  return (
    <Router>
      {/*通知 */}
      <Toast />
      {/*背景色 */}
      <div className={`min-h-screen flex justify-center items-center transition-all duration-300 ${darkMode ? "bg-gray-900" : "bg-sky-200/40"}`}>
        {/*主体 */}
        <div className="w-4/5 sm:w-4/5 md:w-3/5 lg:w-2/5 min-h-screen flex flex-col items-center bg-transparent">
           {/* Header Image */}
           <div
            className="w-full h-[28vh] bg-cover rounded-3xl"
            style={{
              backgroundImage: "url('https://pic.en1an.com/2025/03/30/67e82c28b640e.jpg')",
              backgroundPosition: "top -40px center",
            }}
          >
            <div className="h-full flex items-center justify-center text-white text-4xl font-bold">
              <h1>YiNiann's NAV</h1>
            </div>
          </div>
          {/*导航栏 */}
          <nav className={`w-full  mt-4 mb-4 flex items-center bg-opacity-40 p-1 shadow-md rounded-xl transition-all duration-300 ${darkMode ? "bg-gray-700" : "bg-sky-500"}`}>
            <div className="flex-1 flex justify-center space-x-6">
              <Link to="/" className="text-white font-mono hover:underline">Home</Link>
              <Link to="/notepad" className="text-white font-mono hover:underline">Notepad</Link>
              <Link to="/manage" className="text-white font-mono hover:underline">Manage</Link>
            </div>

            {/* Toggle button for drag/delete */}
            <button
              onClick={toggleSort}
              className="text-white bg-gray-500/50 p-2 rounded-3xl  transition-transform duration-200 hover:bg-gray-500 hover:rotate-6 mt-auto"
            >
              {isDragDeleteEnabled ? "Done" : "Sort"}
            </button>
            <DarkModeToggle />
          </nav>

          <Routes>
            <Route path="/" element={<Home isDragDeleteEnabled={isDragDeleteEnabled} />} />
            <Route path="/Notepad" element={<Notepad />} />
            <Route path="/manage" element={<Manage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
