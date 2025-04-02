import Cards from "./components/Cards";

const Home = ({ isDragDeleteEnabled }) => {
  return (
    <div className="w-full text-center text-2xl flex flex-col items-center">
      <Cards isDragDeleteEnabled={isDragDeleteEnabled} />
    </div>
  );
};

export default Home;
