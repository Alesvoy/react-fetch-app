import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOG_SEARCH, LOGOUT_URL, POST_DOGS } from "../utils/urls";
import { useQuery } from "react-query";
import BreedsFilter from "../components/BreedsFilter";
import { toast } from "react-hot-toast";

interface IDog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const getDogs = async (page: number, breeds: string[], sort: string) => {
  const newBreedsString = breeds
    .map((item: string) => `breeds=${item}`)
    .join("&");

  try {
    const dogIds = await axios.get(
      breeds.length > 0
        ? `${DOG_SEARCH}?from=${
            (page - 1) * 25
          }&${newBreedsString}&sort=name:${sort}`
        : `${DOG_SEARCH}?from=${(page - 1) * 25}&sort=name:${sort}`,
      {
        withCredentials: true,
      }
    );
    return axios.post(`${POST_DOGS}`, dogIds.data.resultIds, {
      withCredentials: true,
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

const DogSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filteredBreeds, setFilteredBreeds] = useState<string[]>(
    searchParams.getAll("breeds")
  );
  const [sort, setSort] = useState<string>(searchParams.get("sort") || "asc");
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );

  const navigate = useNavigate();

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
        navigate("/login");
      } else {
        toast.error("Oops something went wrong, please log in again!", {
          duration: 5000,
          position: "top-center",
        });
        navigate("/login");
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
    <div>
      <h1>Dog Match!</h1>
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
        <div>
          {dogs.data &&
            dogs.data.data.map((item: IDog) => (
              <div key={item.id}>
                <img
                  style={{ width: "200px", height: "200px" }}
                  src={item.img}
                />
                <h3>{item.name}</h3>
              </div>
            ))}
        </div>
      )}
      <div>
        <button
          onClick={async () => {
            try {
              await axios.post(
                LOGOUT_URL,
                {},
                {
                  withCredentials: true,
                }
              );
              navigate("/login");
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
          }}
        >
          Log out
        </button>
      </div>
      <div>
        <p>Current Page: {page}</p>
        <button
          disabled={page <= 1}
          onClick={() => {
            setPage((currPage) => (currPage -= 1));
          }}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setPage((currPage) => (currPage += 1));
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DogSearch;
