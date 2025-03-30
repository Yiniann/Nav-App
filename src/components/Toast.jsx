import { useSelector, useDispatch } from "react-redux"
import { hideToast } from "../stores/toastSlice"
import { useEffect } from "react"

const Toast = () => {
  const { message, visible } = useSelector((state) => state.toast);
  const dispatch = useDispatch()

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        dispatch(hideToast())
      }, 3000);
    }
  }, [visible, dispatch])

  if (!visible) return null

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg text-2xl">
      {message}
    </div>
  );
};

export default Toast;
