import { useState } from "react";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (eventOrValue) => {
    if (typeof eventOrValue === "string") {
      // 处理 ReactQuill 直接传递的字符串值
      setValue(eventOrValue);
    } else {
      setValue(eventOrValue.target.value);
    }
  };

  const reset = () => {
    setValue("");
  };

  return {
    fieldProps: { type, value, onChange },
    reset,
  };
};

export default useField;
