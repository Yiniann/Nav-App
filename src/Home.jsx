import Cards from "./components/Cards";

const Home = ({ isDragDeleteEnabled }) => {
  return (
    <div className="text-center text-2xl flex flex-col items-center">
      <Cards isDragDeleteEnabled={isDragDeleteEnabled} />
    </div>
  );
};

export default Home;
