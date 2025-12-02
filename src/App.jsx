import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import MovieDetail from "./components/movie/MovieDetail";
import SearchMovies from "./components/search/SearchMovies";
import RequiredAuth from "./components/RequiredAuth";

function App() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Header />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas con layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movie/:imdb_id" element={<MovieDetail />} />
          <Route path="search" element={<SearchMovies />} />

          {/* Rutas protegidas */}
          <Route element={<RequiredAuth />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
