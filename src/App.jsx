import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Home from "./Home"
import About from "./About"
import Contact from "./Contact"
import DarkModeToggle from "./components/DarkModeToggle"
import Toast from "./components/Toast"

export default function App() {
  const darkMode = useSelector((state) => state.darkMode);

  return (
    <Router>
      {/*通知 */}
      <Toast />
      <div className={`min-h-screen flex justify-center items-center transition-all duration-300 ${darkMode ? "bg-gray-900" : "bg-sky-200/40"}`}>
        <div className="h-screen flex flex-col items-center bg-transparent">
           {/* Header Image */}
           <div
            className="mt-6 w-250 h-100 bg-cover rounded-3xl"
            style={{
              backgroundImage: "url('https://pic.en1an.com/2025/03/30/67e82c28b640e.jpg')",
              backgroundPosition: "top -40px center",
            }}
          >
            <div className="h-full flex items-center justify-center text-white text-4xl font-bold">
              <h1>YiNiann's NAV</h1>
            </div>
          </div>
          <nav className={`w-250 mt-4 mb-4 flex items-center bg-opacity-40 p-4 shadow-md rounded-xl transition-all duration-300 ${darkMode ? "bg-gray-700" : "bg-sky-500"}`}>
            <div className="flex-1 flex justify-center space-x-6">
              <Link to="/" className="text-white font-mono hover:underline">Home</Link>
              <Link to="/about" className="text-white font-mono hover:underline">About</Link>
              <Link to="/contact" className="text-white font-mono hover:underline">Contact</Link>
            </div>
            <DarkModeToggle />
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
