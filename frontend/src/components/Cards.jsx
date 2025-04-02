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
      dispatch(showToast("Please enter all fields!"));
      return;
    }

    const currentCards = await dispatch(fetchCards()).unwrap();
    const maxOrder = currentCards.length ? Math.max(...currentCards.map(card => card.order)) : 0;

    const newCard = {
      title: title.fieldProps.value,
      description: description.fieldProps.value,
      url: url.fieldProps.value,
      buttonText: buttonText.fieldProps.value,
      isNewTab: true,
      order: maxOrder + 1,
    };

    try {
      await dispatch(addCard(newCard));
      dispatch(showToast(`Card "${newCard.title}" added successfully`));

      title.reset();
      description.reset();
      url.reset();
      buttonText.reset();
    } catch (error) {
      console.error("Failed to add card:", error);
      dispatch(showToast("Failed to add card"));
    } finally {
      setIsAdding(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination || !isDragDeleteEnabled) return;
    const { source, destination } = result;
    dispatch(reorderCards({ sourceIndex: source.index, destinationIndex: destination.index }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      dispatch(removeCard(id));
      dispatch(showToast(`Card deleted successfully`));
    }
  };

  return (
    <div className="w-full">
      {/* 普通模式 */}
      {!isDragDeleteEnabled && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="p-5 bg-white shadow-lg rounded-3xl text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col min-h-40"
            >
              <h3 className="p-2 text-xl font-bold mb-2">{card.title}</h3>
              <p className="p-2 text-xl text-gray-600 flex-grow">{card.description}</p>
              <button
                onClick={() =>
                  card.isNewTab ? window.open(card.url, "_blank") : (window.location.href = card.url)
                }
                className="text-sm px-6 py-2 bg-cyan-500 text-white rounded-3xl hover:bg-cyan-600 w-full mt-auto"
              >
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 拖拽模式 */}
      {isDragDeleteEnabled && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="cardsGrid" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-3 bg-white shadow-lg rounded-3xl text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full ${snapshot.isDragging ? "opacity-70" : ""}`}
                      >
                        <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                        <p className="text-xl text-gray-600 flex-grow mb-4">{card.description}</p>
                        <button
                          onClick={() =>
                            card.isNewTab ? window.open(card.url, "_blank") : (window.location.href = card.url)
                          }
                          className="text-sm px-6 py-2  bg-cyan-500 text-white rounded-3xl hover:bg-cyan-600 w-full mt-auto"
                        >
                          {card.buttonText}
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="text-sm px-6 py-2 mt-1 bg-red-500 text-white rounded-lg w-full"
                        >
                          删除
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}

                {/* 新增卡片 */}
                {isAdding ? (
                  <div className="p-6 bg-white shadow-lg rounded-3xl flex flex-col h-full w-full">
                    <input {...title.fieldProps} placeholder="Title" className="border p-2 w-full rounded mb-2 text-sm" />
                    <input {...description.fieldProps} placeholder="Description" className="border p-2 w-full rounded mb-2 text-sm" />
                    <input {...url.fieldProps} placeholder="Url" className="border p-2 w-full rounded mb-2 text-sm" />
                    <input {...buttonText.fieldProps} placeholder="Button Text" className="border p-2 w-full rounded mb-2 text-sm" />
                    <div className="flex justify-between">
                      <button onClick={() => setIsAdding(false)} className="mr-1 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm">CANCEL</button>
                      <button onClick={handleAddCard} className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm">ADD</button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsAdding(true)}
                    className="p-3 bg-white shadow-lg rounded-3xl text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full justify-center items-center cursor-pointer"
                  >
                    <span className="text-2xl">➕</span>
                    <p className="text-xl text-gray-600 mt-2 flex justify-center items-center">Add New Nav</p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default Cards;
