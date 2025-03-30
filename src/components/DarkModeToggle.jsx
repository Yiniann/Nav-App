import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../stores/darkModeSlice";

const DarkModeToggle = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode);

  return (
    <button
      onClick={() => dispatch(toggleDarkMode())}
      className="ml-4 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 dark:text-white text-gray-900 shadow-md"
    >
      {darkMode ? "🌞" : "🌙"}
    </button>
  );
};

export default DarkModeToggle;  
