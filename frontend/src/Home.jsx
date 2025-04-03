import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCards, addCard, removeCard, reorderCards } from "./stores/cardsSlice";
import { showToast } from "./stores/toastSlice";
import Cards from "./components/Cards";
import useField from "./hooks/useField";

const Home = () => {
  const [isDragDeleteEnabled, setIsDragDeleteEnabled] = useState(false); 
  const darkMode = useSelector((state) => state.darkMode)
  const cards = useSelector((state) => state.cards || []);
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  const title = useField("text");
  const description = useField("text");
  const url = useField("url");
  const buttonText = useField("text");

  const handleAddCard = async () => {
    if (!title.fieldProps.value || !description.fieldProps.value || !url.fieldProps.value || !buttonText.fieldProps.value) {
      dispatch(showToast("Please enter all fields!"));
      return;
    }

    const currentCards = await dispatch(fetchCards()).unwrap();
    const maxOrder = currentCards.length ? Math.max(...currentCards.map(card => card.order)) : 0;

    const formatUrl = (inputUrl) => {
      try {
        new URL(inputUrl);
        return inputUrl;
      } catch (e) {
        return `//${inputUrl}`;
      }
    };

    const newCard = {
      title: title.fieldProps.value,
      description: description.fieldProps.value,
      url: formatUrl(url.fieldProps.value),
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      dispatch(removeCard(id))
        .unwrap() 
        .then(() => {
          dispatch(showToast("Card deleted successfully"));
        })
        .catch((error) => {
          console.error("Failed to delete card:", error);
          dispatch(showToast("Failed to delete card"));
        });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination || !isDragDeleteEnabled) return;
    const { source, destination } = result;
    dispatch(reorderCards({ sourceIndex: source.index, destinationIndex: destination.index }));
  };

  const toggleSort = () => {
    setIsDragDeleteEnabled(!isDragDeleteEnabled); 
  };

  return (
    <div className="w-full text-center text-2xl flex flex-col items-center">
      <Cards
        cards={cards}
        isDragDeleteEnabled={isDragDeleteEnabled}
        handleDelete={handleDelete}
        handleDragEnd={handleDragEnd}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
      />
      {isDragDeleteEnabled && isAdding && (
        <div className="mt-3 p-6 bg-white shadow-lg rounded-3xl flex flex-col h-full w-full mb-4">
          <input {...title.fieldProps} placeholder="Title" className="border p-2 w-full rounded mb-2 text-sm" />
          <input {...description.fieldProps} placeholder="Description" className="border p-2 w-full rounded mb-2 text-sm" />
          <input {...url.fieldProps} placeholder="Url" className="border p-2 w-full rounded mb-2 text-sm" />
          <input {...buttonText.fieldProps} placeholder="Button Text" className="border p-2 w-full rounded mb-2 text-sm" />
          <div className="flex justify-between">
            <button onClick={() => setIsAdding(false)} className="mr-1 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm">CANCEL</button>
            <button onClick={handleAddCard} className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm">ADD</button>
          </div>
        </div>
      )}
      {/*切换Sort */}
      <div className="mt-2 w-full flex justify-end">
      <label className="flex items-center cursor-pointer">
        <span className={`mr-3 ${darkMode ? "text-white" : "text-dark"}`}>{isDragDeleteEnabled ? "Done" : "Sort"}</span>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isDragDeleteEnabled}
            onChange={toggleSort}
          />
          <div
            className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
              isDragDeleteEnabled ? "bg-green-500" : "bg-gray-500"
            }`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-all duration-300 ${
              isDragDeleteEnabled ? "translate-x-6 bg-white" : "bg-white"
            }`}
          ></div>
        </div>
      </label>
    </div>
    </div>
  );
};

export default Home;
