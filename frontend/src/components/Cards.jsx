import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCards, addCard, removeCard, reorderCards } from "../stores/cardsSlice";
import { showToast } from "../stores/toastSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useField from "../hooks/useField";

const Cards = ({ isDragDeleteEnabled }) => {
  const cards = useSelector((state) => state.cards || []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  const title = useField("text");
  const description = useField("text");
  const url = useField("url");
  const buttonText = useField("text");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCard = async () => {
    if (!title.fieldProps.value || !description.fieldProps.value || !url.fieldProps.value || !buttonText.fieldProps.value) {
      dispatch(showToast(`Please enter all fields!`));
      return;
    }

    const newCard = {
      title: title.fieldProps.value,
      description: description.fieldProps.value,
      url: url.fieldProps.value,
      buttonText: buttonText.fieldProps.value,
      isNewTab: true,
      order: cards.length, // 新增 order 逻辑
    };

    await dispatch(addCard(newCard));
    dispatch(showToast(`Card "${newCard.title}" added successfully`));

    title.reset();
    description.reset();
    url.reset();
    buttonText.reset();
    setIsAdding(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    dispatch(reorderCards({ sourceIndex: source.index, destinationIndex: destination.index }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      dispatch(removeCard(id))
      dispatch(showToast(`Card deleted successfully`))
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="cardsGrid" direction="horizontal">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} 
                     {...(isDragDeleteEnabled ? provided.dragHandleProps : {})} 
                     className={`w-80 p-6 bg-white shadow-lg rounded-3xl text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl ${snapshot.isDragging ? "opacity-70" : ""}`}>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <button onClick={() => card.isNewTab ? window.open(card.url, "_blank") : (window.location.href = card.url)} 
                    className="px-6 py-2 bg-cyan-500 text-white rounded-3xl hover:bg-cyan-600 w-full">
                    {card.buttonText}
                  </button>
                  {isDragDeleteEnabled && <button onClick={() => handleDelete(card.id)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg w-full">删除</button>}
                </div>
              )}
            </Draggable>
            ))}
            {provided.placeholder}

            {isDragDeleteEnabled && (isAdding ? (
              <div className="w-80 p-6 bg-white shadow-lg rounded-3xl">
                <input {...title.fieldProps} placeholder="Title" className="border p-2 w-full rounded mb-2" />
                <input {...description.fieldProps} placeholder="Description" className="border p-2 w-full rounded mb-2" />
                <input {...url.fieldProps} placeholder="Url" className="border p-2 w-full rounded mb-2" />
                <input {...buttonText.fieldProps} placeholder="Button Text" className="border p-2 w-full rounded mb-2" />
                <div className="flex justify-between">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">取消</button>
                  <button onClick={handleAddCard} className="px-4 py-2 bg-cyan-500 text-white rounded-lg">添加</button>
                </div>
              </div>
            ) : (
              <div onClick={() => setIsAdding(true)} className="w-80 h-52 flex flex-col justify-center items-center bg-gray-100 shadow-lg rounded-3xl cursor-pointer hover:scale-105 hover:shadow-2xl">
                <span className="text-4xl">➕</span>
                <p className="text-gray-600 mt-2">Add New Navigation</p>
              </div>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Cards;
