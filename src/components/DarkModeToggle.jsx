import { useContext } from "react";
import { DarkModeContext } from "../stores/DarkModeContext.jsx";

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className="ml-4 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 dark:text-white text-gray-900 shadow-md"
    >
      {darkMode ? "🌞" : "🌙"}
    </button>
  );
};

export default DarkModeToggle;
