import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCard } from "./stores/cardsSlice";
import useField from "./hooks/useField";

const Home = () => {
  const cards = useSelector((state) => state.cards);
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const title = useField("text");
  const description = useField("text");
  const url = useField("url");
  const buttonText = useField("text");

  const handleAddCard = () => {
    if (!title.fieldProps.value || !description.fieldProps.value || !url.fieldProps.value || !buttonText.fieldProps.value) {
      alert("请填写所有字段！");
      return;
    }

    dispatch(addCard({
      title: title.fieldProps.value,
      description: description.fieldProps.value,
      url: url.fieldProps.value,
      buttonText: buttonText.fieldProps.value,
      isNewTab: true,
    }));

    title.reset();
    description.reset();
    url.reset();
    buttonText.reset();
    setIsAdding(false);
  };

  return (
    <div className="text-center text-2xl flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="w-80 p-6 bg-white shadow-lg rounded-3xl text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-gray-600 mb-4">{card.description}</p>
            <div className="flex justify-center w-full">
              <button 
                onClick={() => card.isNewTab ? window.open(card.url, "_blank") : (window.location.href = card.url)}
                className="px-6 py-2 bg-cyan-500 text-white rounded-3xl hover:bg-cyan-600 w-full">
                {card.buttonText}
              </button>
            </div>
          </div>
        ))}

        {isAdding ? (
          <div className="w-80 p-6 bg-white shadow-lg rounded-3xl text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <input {...title.fieldProps} placeholder="卡片标题" className="border p-2 w-full rounded mb-2" />
            <input {...description.fieldProps} placeholder="卡片描述" className="border p-2 w-full rounded mb-2" />
            <input {...url.fieldProps} placeholder="链接地址" className="border p-2 w-full rounded mb-2" />
            <input {...buttonText.fieldProps} placeholder="按钮文本" className="border p-2 w-full rounded mb-2" />
            <div className="flex justify-between">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">取消</button>
              <button onClick={handleAddCard} className="px-4 py-2 bg-cyan-500 text-white rounded-lg">添加</button>
            </div>
          </div>
        ) : (
          <div onClick={() => setIsAdding(true)}
               className="w-80 h-52 flex flex-col justify-center items-center bg-gray-100 shadow-lg rounded-3xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <span className="text-4xl">➕</span>
            <p className="text-gray-600 mt-2">添加新卡片</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
