import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Cards = ({ 
  cards, 
  isDragDeleteEnabled, 
  handleDelete, 
  handleDragEnd,
  isAdding,
  setIsAdding
}) => {
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
                          className="text-sm px-6 py-2 bg-cyan-500 text-white rounded-3xl hover:bg-cyan-600 w-full mt-auto"
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
                {/* 只有在 `isDragDeleteEnabled` 为 true 时显示“新增”按钮 */}
                {isDragDeleteEnabled && !isAdding && (
                  <div onClick={() => setIsAdding(true)} className="p-3 bg-white shadow-lg rounded-3xl flex flex-col justify-center items-center cursor-pointer">
                    <span className="text-2xl">➕</span>
                    <p className="text-xl text-gray-600 mt-2">Add New Nav</p>
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
