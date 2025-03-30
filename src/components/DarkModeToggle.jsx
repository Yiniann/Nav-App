import { useDispatch, useSelector } from "react-redux"
import { toggleDarkMode } from "../stores/darkModeSlice"
import { showToast } from "../stores/toastSlice"

const DarkModeToggle = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode)

  const handleToggle = () => {
    dispatch(toggleDarkMode());
    dispatch(showToast(darkMode ? "Light mode enabled" : "Dark mode enabled"));
  };  

  return (
    <button
      onClick={handleToggle}
      className="ml-4 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 dark:text-white text-gray-900 shadow-md"
    >
      {darkMode ? "🌞" : "🌙"}
    </button>
  )
}

export default DarkModeToggle