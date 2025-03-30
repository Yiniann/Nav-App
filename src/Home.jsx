const Home = () => {
  return (
    <div className="text-center text-2xl flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="w-80 p-6 bg-white shadow-lg rounded-3xl text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">  
          <h3 className="text-xl font-bold mb-2">Blog</h3>
          <p className="text-gray-600 mb-4">YiNiann's Site</p>
          <div className="flex justify-center w-full">
            <button 
              onClick={() => window.location.href = 'https://en1an.com'} 
              className="px-6 py-2 bg-cyan-500 text-white rounded-3xl hover:bg-cyan-600 w-full"
            >
              前往博客 👉
            </button>
          </div>
        </div>

        <div className="w-80 p-6 bg-white shadow-lg rounded-3xl text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">  
          <h3 className="text-xl font-bold mb-2">Shuttle</h3>
          <p className="text-gray-600 mb-4">Network sevice</p>
          <div className="flex justify-center w-full">
            <button 
              onClick={() => window.location.href = 'https://shuttle.en1an.com'} 
              className="px-6 py-2 bg-cyan-500 text-white rounded-3xl hover:bg-cyan-600 w-full"
            >
              Shuttle 🚀
            </button>
          </div>
        </div>

        <div className="w-80 p-6 bg-white shadow-lg rounded-3xl text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">  
          <h3 className="text-xl font-bold mb-2">Tg</h3>
          <p className="text-gray-600 mb-4">Contact Me</p>
          <div className="flex justify-center w-full">
            <button 
              onClick={() => window.open ('https://t.me/y1niannn','_blank')} 
              className="px-6 py-2 bg-cyan-500 text-white rounded-3xl hover:bg-cyan-600 w-full"
            >
              Telegram ✈️
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
