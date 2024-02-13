import { useEffect, useState } from "react";

const moviesList = [
  {
    name: "The Contructor",
    imageUrl: "https://i.pravatar.cc/50",
    releaseDate: 2010,
    rating: 7.8,
    myRating: 10,
    time: 114,
    isWatched: true,
    id: crypto.randomUUID(),
  },
  {
    name: "End Game",
    imageUrl: "https://i.pravatar.cc/60",
    releaseDate: 2000,
    rating: 9.8,
    myRating: 6,
    time: 140,
    isWatched: true,
    id: crypto.randomUUID(),
  },
  {
    name: "No Game",
    imageUrl: "https://i.pravatar.cc/20",
    releaseDate: 1994,
    rating: 6.8,
    myRating: 7,
    time: 110,
    isWatched: false,
    id: crypto.randomUUID(),
  },
  {
    name: "Start Game",
    imageUrl: "https://i.pravatar.cc/25",
    releaseDate: 2006,
    rating: 3,
    myRating: 5,
    time: 190,
    isWatched: true,
    id: crypto.randomUUID(),
  },
];

const moviesWatched = [
  {
    name: "Pakistan",
    imageUrl: "https://i.pravatar.cc/66",
    rating: 7.8,
    myRating: 10,
    time: 114,
  },
  {
    name: "Iran",
    imageUrl: "https://i.pravatar.cc/86",
    rating: 9.8,
    myRating: 6,
    time: 140,
  },
];

function App() {
  const [listOfmovies, setListOfMovies] = useState(moviesList);
  return (
    <div className="flex flex-col items-center h-dvh bg-gray-900">
      <SearchBar />
      <MoviesBar moviesList={listOfmovies} />
    </div>
  );
}

export default App;

function SearchBar() {
  return (
    <div className=" bg-[#6741d9] w-11/12 h-16 rounded-md mt-4 flex justify-between p-4 items-center">
      <div className="flex gap-2">
        <span>🍿</span>
        <h1 className="font-semibold text-white text-xl">usePopcorn</h1>
      </div>
      <input
        type="text"
        placeholder="Search movies..."
        className="w-96 p-2 rounded-md font-semibold bg-[#7950f2] outline-none text-white shadow-current	"
      />
      <p className="text-white">Found 0 results</p>
    </div>
  );
}

function MoviesBar({ moviesList }: any) {
  return (
    <div className="flex flex-1 gap-20  my-4  ">
      <MoviesList moviesList={moviesList} />
      <MoviesYouWatchedList movies={moviesList} />
    </div>
  );
}

function MoviesList({ moviesList }: any) {
  const [isListOpen, setIsListOpen] = useState(true);
  return (
    <div className="flex flex-col gap-0.5 w-96 rounded-lg p-2 bg-gray-800 opacity-80">
      <span
        className="w-6 h-6 self-end rounded-full bg-black text-white flex items-center justify-center font-bold absolute cursor-pointer"
        onClick={() => setIsListOpen(!isListOpen)}
      >
        {isListOpen ? "–" : "+"}
      </span>
      {isListOpen && (
        <div>
          {moviesList.map((movie: any) => (
            <Movie movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

function Movie({ movie }: any) {
  //   const [image, setImage] = useState("");

  //   useEffect(() => {
  //     const fetchImage = async () => {
  //       const response = await fetch(`${movie.imageUrl}`);
  //       const data = await response.json();
  //       setImage(data);
  //     };
  //     fetchImage();
  //   }, []);
  return (
    <div className="flex border-b-[0.5px] bg-gray-800 border-slate-500  p-1 rounded-sm text-white gap-4 items-center">
      <img
        src={movie.imageUrl}
        alt={movie.name}
        className="object-contain w-10 h-16"
      />
      <div>
        <p>{movie.name}</p>
        <p>📅 {movie.releaseDate}</p>
      </div>
    </div>
  );
}

function MoviesYouWatchedList({ movies }: any) {
  const [isWatchedListOpen, setIsWatchedListOpen] = useState(true);

  const moviesWatched = movies.filter((movie: any) => movie.isWatched);

  return (
    <div className="flex flex-col w-96 rounded-lg bg-gray-800 text-white relative">
      <span
        className="w-6 h-6 self-end rounded-full bg-black text-white flex items-center justify-center font-bold absolute  cursor-pointer z-10 top-2 right-2"
        onClick={() => setIsWatchedListOpen(!isWatchedListOpen)}
      >
        {isWatchedListOpen ? "–" : "+"}
      </span>
      {isWatchedListOpen && (
        <>
          <WatchedData
            movies={moviesWatched}
            onWatchedListOpen={setIsWatchedListOpen}
            isWatchedListOpen={isWatchedListOpen}
          />
          <div>
            {moviesWatched.map((movie: any) => (
              <WatchedMovie movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function WatchedData({ movies }: any) {
  function averageCalc(property: any, arr: any) {
    const sum = arr.reduce((acc: number, movie: any) => {
      return acc + movie[property];
    }, 0);
    return sum / arr.length;
  }
  const rating = averageCalc("rating", movies);
  const myRating = averageCalc("myRating", movies);
  const time = averageCalc("time", movies);

  return (
    <div className="flex flex-col justify-center bg-gray-700 p-4 rounded-md relative">
      <p className="font-semibold">MOVIES YOU WATCHED</p>
      <div className="flex gap-4">
        <span>☯{2} movies</span>
        <span>⭐{rating} </span>
        <span>🌟{myRating}</span>
        <span>⌛{time} min</span>
      </div>
    </div>
  );
}

function WatchedMovie({ movie }: any) {
  return (
    <div className="flex border-b-[0.5px]  bg-gray-800 border-slate-500  p-3 rounded-sm text-white gap-4 items-center">
      <img
        src={movie.imageUrl}
        alt={movie.name}
        className="object-contain w-10 h-16"
      />
      <div className=" w-full">
        <p>{movie.name}</p>
        <div className="flex gap-4">
          <span className="">⭐{movie.rating}</span>
          <span>🌟{movie.myRating}</span>
          <span>⌛{movie.time} min</span>
        </div>
      </div>
    </div>
  );
}
