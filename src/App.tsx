import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  return (
    <div className="flex flex-col items-center h-dvh bg-gray-900">
      <SearchBar onSetTitle={setTitle} title={title} />
      <MoviesBar title={title} />
    </div>
  );
}

export default App;

function SearchBar({ onSetTitle, title }: any) {
  return (
    <div className=" bg-[#6741d9] w-11/12 h-16 rounded-md mt-4 flex justify-between p-4 items-center">
      <Logo />
      <Input onSetTitle={onSetTitle} title={title} />
      <p className="text-white">Found 0 results</p>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex gap-2">
      <span>🍿</span>
      <h1 className="font-semibold text-white text-xl">usePopcorn</h1>
    </div>
  );
}
function Input({ onSetTitle }: any) {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      className="w-96 p-2 rounded-md font-semibold bg-[#7950f2] outline-none text-white shadow-current	"
      onChange={(e) => onSetTitle(e.target.value)}
    />
  );
}

function MoviesBar({ title }: any) {
  const [listOfmovies, setListOfMovies] = useState([]);
  const [selectedMovie, setSeletedMovie] = useState("");
  const [userStars, setUserStars] = useState<any>();

  function handleSelectMovie(title: any) {
    setSeletedMovie(title);
    setUserStars(null);
  }
  function handleUserStars(id: any) {
    setUserStars(id);
  }

  useEffect(() => {
    const intervalId = setTimeout(async function () {
      console.log(title, "========title");
      if (!title) {
        setListOfMovies([]);
        setSeletedMovie("");
      }
      if (title.length == 2) return;
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_MOVIE_API_KEY
        }&s=${title}`
      );
      const { Search } = await response.json();
      if (!Search) return;
      setListOfMovies(Search);
    }, 2000);
    return () => {
      clearTimeout(intervalId);
    };
  }, [title]);
  console.log(listOfmovies, "===========listOfMovies");
  console.log(selectedMovie, "=========selectedMovie");
  return (
    <div className="flex flex-1 w-full gap-6  my-4  overflow-hidden">
      <MoviesList moviesList={listOfmovies} onSelectMovie={handleSelectMovie} />
      <SelectedAndWatchedMovies
        selectedMovie={selectedMovie}
        onSelectedMovie={setSeletedMovie}
        onUserStars={handleUserStars}
        userStars={userStars ? userStars : 0}
      />
    </div>
  );
}

function MoviesList({ moviesList, onSelectMovie }: any) {
  const [isListOpen, setIsListOpen] = useState(true);
  return (
    <div className="flex flex-1 justify-end">
      <div className="flex flex-col w-8/12 gap-0.5 rounded-lg p-2 bg-gray-800 opacity-80 overflow-y-auto relative  z-0">
        <ToggleMovieMenu onIsListOpen={setIsListOpen} open={isListOpen} />
        {isListOpen && (
          <div className="">
            {moviesList.map((movie: any) => (
              <Movie movie={movie} onSelectMovie={onSelectMovie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Movie({ movie, onSelectMovie }: any) {
  return (
    <div
      className="flex border-b-[0.5px] bg-gray-800 border-slate-500  p-1 rounded-sm text-white gap-4 items-center cursor-pointer hover:bg-gray-600"
      onClick={() => onSelectMovie(movie.Title)}
    >
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="object-contain w-10 h-16"
      />
      <div>
        <p>{movie.Title}</p>
        <p>📆 {movie.Year}</p>
      </div>
    </div>
  );
}

function SelectedAndWatchedMovies({
  selectedMovie,
  onSelectedMovie,
  onUserStars,
  userStars,
}: any) {
  const [isWatchedListOpen, setIsWatchedListOpen] = useState(true);
  const [watchedMovies, setWatchedMovies] = useState<any>([]);
  const [searchedMovie, setSearchedMovie] = useState(null);

  function handleWatchedMovies(movie: any) {
    console.log(movie, "=============movie");
    setWatchedMovies(() => [...watchedMovies, movie]);
    onSelectedMovie(null);
  }

  function handleFilteredMovies(movie: any) {
    console.log(movie, "===========movie");
    const updated = watchedMovies.filter((w: any) => w.imdbID != movie.imdbID);

    setWatchedMovies(updated);
  }

  useEffect(() => {
    const fetchData = async function () {
      if (!selectedMovie) setSearchedMovie(null);
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=654c0727&t=${selectedMovie}`
      );
      const searchedMovie = await response.json();
      console.log(searchedMovie, "===============searchedMovie");
      if (searchedMovie.Response != "False") {
        setSearchedMovie(searchedMovie);
        // setWatchedMovies((prevMovie: any) => [...prevMovie, searchedMovie]);
      }
    };
    const interval = setTimeout(fetchData, 1000);
    return () => {
      clearTimeout(interval);
    };
  }, [selectedMovie]);
  console.log(watchedMovies, "============watchedMovies");

  return (
    <div className="flex flex-1 ">
      <div className="flex flex-col w-8/12 rounded-lg bg-gray-800 opacity-80 text-white relative">
        <ToggleMovieMenu
          onIsListOpen={setIsWatchedListOpen}
          open={isWatchedListOpen}
        />
        {selectedMovie && (
          <MovieDescription
            searchedMovie={searchedMovie}
            onAddMovie={handleWatchedMovies}
            onUserStars={onUserStars}
            userStars={userStars}
          />
        )}
        {isWatchedListOpen && !selectedMovie && (
          <WatchedMovieWrapper
            watchedMovies={watchedMovies}
            onFilterWatchedMovies={handleFilteredMovies}
          />
        )}
      </div>
    </div>
  );
}

function WatchedMovieWrapper({ watchedMovies, onFilterWatchedMovies }: any) {
  return (
    <>
      <WatchedMovieData movies={watchedMovies} />
      <div>
        {watchedMovies.length != 0 &&
          watchedMovies.map((movie: any) => (
            <WatchedMovie
              movie={movie}
              onFilterWatchedMovies={onFilterWatchedMovies}
            />
          ))}
      </div>
    </>
  );
}

function WatchedMovieData({ movies }: any) {
  function averageCalc(property: any, arr: any) {
    if (!arr) return;
    const sum = arr.reduce((acc: number, movie: any) => {
      return acc + movie[property];
    }, 0);
    let average = sum / arr.length;
    return Number.isInteger(average) ? average : average.toFixed(2);
  }
  const rating = averageCalc("imdbRating", movies);
  const myRating = averageCalc("myRating", movies);
  const time: any = averageCalc("Runtime", movies);

  return (
    <div className="flex flex-col justify-center bg-gray-700 p-4 rounded-md relative">
      <p className="font-semibold">MOVIES YOU WATCHED</p>
      <div className="flex gap-4">
        <span>☯{movies.length} movies</span>
        <span>⭐{rating} </span>
        <span>🌟{myRating}</span>
        <span>⌛{time}</span>
      </div>
    </div>
  );
}

function WatchedMovie({ movie, onFilterWatchedMovies }: any) {
  return (
    <div className="flex border-b-[0.5px]  bg-gray-800 border-slate-500  p-3 rounded-sm text-white gap-4 items-center">
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="object-contain w-10 h-16"
      />
      <div className="w-full">
        <p>{movie.Title}</p>
        <div className="flex gap-4">
          <span className="">⭐{movie.imdbRating}</span>
          <span>🌟{movie.myRating}</span>
          <span>⌛{movie.Runtime}</span>
        </div>
      </div>
      <button
        className="w-8 bg-red-700 mr-2"
        onClick={() => onFilterWatchedMovies(movie)}
      >
        ✖
      </button>
    </div>
  );
}

function MovieDescription({
  searchedMovie,
  onAddMovie,
  onUserStars,
  userStars,
}: any) {
  if (!searchedMovie) return;
  return (
    <div className="no-scrollbar flex flex-col overflow-y-scroll">
      <MoviePreview movie={searchedMovie} />
      <MovieSummary
        movie={searchedMovie}
        onAddMovie={onAddMovie}
        onUserStars={onUserStars}
        userStars={userStars}
      />
    </div>
  );
}

function MoviePreview({ movie }: any) {
  console.log(movie);
  console.log(movie.Released);
  return (
    <div className="flex items-center gap-6 bg-gray-700 placeholder-opacity-80">
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="object-cover w-32 h-52 "
      />
      <div className="flex flex-col gap-2 px-4">
        <h3 className="font-bold text-2xl">{movie.Title}</h3>
        <span>
          {movie.Released} • {movie.Runtime}
        </span>
        <span>{movie.Genre}</span>
        <span>⭐{movie.imdbRating} IMDb rating</span>
      </div>
    </div>
  );
}

function MovieSummary({ movie, onAddMovie, onUserStars, userStars }: any) {
  // const [userStars, setUserStars] = useState<any>();
  const [hoverId, setHoverId] = useState<any>();

  // function handleUserStars(e: any) {
  //   console.log(e.target.id);
  //   setUserStars(e.target.id);
  // }
  // console.log(userStars, "====userStars");

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 pt-10">
      <div className="flex flex-col h-28 w-3/4 mb-5 items-center justify-center rounded-xl bg-gray-700 gap-2 p-4">
        <div className="flex gap-2">
          <div className="flex gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(
              (star: any, i: any) => (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  id={i + 1}
                  className=""
                  onClick={(e: any) => onUserStars(e.target.id)}
                  onMouseEnter={() => {
                    if (!userStars) setHoverId(i + 1);
                  }}
                  onMouseLeave={() => {
                    setHoverId(null);
                  }}
                >
                  <polygon
                    points="12,2 15,8 22,8 16,12 18,18 12,14 6,18 8,12 2,8 9,8"
                    fill={`${hoverId > i || userStars > i ? "gold" : "none"}`}
                    stroke="gold"
                    className="cursor-pointer"
                    id={i + 1}
                    // strokeWidth={2}
                  />
                </svg>
              )
            )}
          </div>
          <span>{`${hoverId ? hoverId : userStars} `}</span>
        </div>
        <button
          className="h-20 w-48 rounded-lg flex items-center justify-center bg-indigo-500 hover:bg-indigo-700 "
          onClick={() => onAddMovie(movie)}
        >
          + Add to List
        </button>
      </div>
      <div className="w-3/4 self-center justify-center flex flex-col gap-2">
        <p>
          <em>{movie.Plot}</em>
        </p>
        <p>Starring {movie.Actors}</p>
        <p>Directed by {movie.Director}</p>
      </div>
    </div>
  );
}

function ToggleMovieMenu({ onIsListOpen, open }: any) {
  return (
    <span
      className="w-6 h-6 self-end rounded-full bg-black text-white flex items-center justify-center font-bold absolute cursor-pointer right-2 top-2 z-10"
      onClick={() => onIsListOpen(!open)}
    >
      {open ? "–" : "+"}
    </span>
  );
}
