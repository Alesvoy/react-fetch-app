import { useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LOGOUT_URL } from "../utils/urls";
import { useQuery } from "react-query";
import BreedsFilter from "../components/BreedsFilter";
import { toast } from "react-hot-toast";
import { getDogs } from "../api/dogs";
import { IDog } from "../types/dogs";
import DogCard from "../components/DogCard";
import { FavoritesContext } from "../context/favoritesContext";
import "./DogSearch.css";
import "../Utils.css";

const DogSearch: React.FC = () => {
  const { favorites, setFavorites } = useContext(FavoritesContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [filteredBreeds, setFilteredBreeds] = useState<string[]>(
    searchParams.getAll("breeds")
  );
  const [sort, setSort] = useState<string>(searchParams.get("sort") || "asc");
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );

  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.post(
        LOGOUT_URL,
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/");
      toast.success("Log out successful!", {
        duration: 2000,
        position: "top-center",
      });
    } catch (e) {
      toast.error("Oops something went wrong! Try again.", {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  const dogs = useQuery({
    queryKey: ["dogs", page, filteredBreeds, sort],
    queryFn: () => getDogs(page, filteredBreeds, sort),
    onError: (error: AxiosError) => {
      const newSearchParams = new URLSearchParams([]);
      setSearchParams(newSearchParams);

      if (error.response?.status === 401) {
        toast.error("Unauthorized, please log in again!", {
          duration: 5000,
          position: "top-center",
        });
        navigate("/");
      } else {
        toast.error("Oops something went wrong, please log in again!", {
          duration: 5000,
          position: "top-center",
        });
        navigate("/");
      }
    },
  });

  useEffect(() => {
    const newFilteredBreedsArr = filteredBreeds.map((item: string) => [
      "breeds",
      item,
    ]);
    const newSearchParams = new URLSearchParams([
      ["page", page.toString()],
      ["sort", sort],
      ...newFilteredBreedsArr,
    ]);
    setSearchParams(newSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, filteredBreeds]);

  return (
    <div className="dogSearch">
      <nav className="navbar">
        <h1>Dog Match!</h1>
        <button className="btn logoutBtn" onClick={logoutHandler}>
          Log out
        </button>
      </nav>
      {favorites.length < 1 ? null : (
        <div className="favoriteDogs">
          <h2>Favorites</h2>
          <div className="dogCardItems">
            {favorites.map((item) => (
              <DogCard key={item.id} dogData={item} />
            ))}
          </div>
          <button
            className="btn matchMeButton"
            onClick={() => {
              navigate("/match");
              setFavorites([]);
            }}
          >
            Match me to a dog!
          </button>
        </div>
      )}
      <div>
        <BreedsFilter
          filteredBreeds={filteredBreeds}
          setFilteredBreeds={setFilteredBreeds}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <p>Sort by:</p>
          <select
            name="sort"
            id="sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
      {dogs.status === "loading" ? (
        <h1>Loading...</h1>
      ) : (
        <div className="dogCardItems">
          {dogs.data &&
            dogs.data.data.map((item: IDog) => (
              <DogCard key={item.id} dogData={item} />
            ))}
        </div>
      )}
      <div className="pagination">
        <p>Current Page: {page}</p>
        <div className="paginationBtns">
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => {
              setPage((currPage) => (currPage -= 1));
            }}
          >
            Prev
          </button>
          <button
            className="btn"
            onClick={() => {
              setPage((currPage) => (currPage += 1));
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DogSearch;
