import axios from "axios";
import { DOG_BREEDS } from "../utils/urls";
import { useQuery } from "react-query";
import { useState } from "react";

type Props = {
  filteredBreeds: string[];
  setFilteredBreeds: React.Dispatch<React.SetStateAction<string[]>>;
};

const getBreeds = async () => {
  return axios.get(DOG_BREEDS, { withCredentials: true });
};

const BreedsFilter: React.FC<Props> = ({
  filteredBreeds,
  setFilteredBreeds,
}) => {
  const [showBreeds, setShowBreeds] = useState(false);
  const breedsData = useQuery("breeds", getBreeds);

  let breeds: string[] = [];

  if (breedsData.isSuccess) {
    breeds = [...breeds, ...breedsData.data.data];
  }

  return (
    <div>
      {breedsData.isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <button
            onClick={() => {
              setShowBreeds((prevState: boolean) => !prevState);
            }}
          >{`${showBreeds ? "Hide" : "Show"} Breeds`}</button>
          <div style={{ display: showBreeds ? "block" : "none" }}>
            {breeds.map((item: string) => (
              <div
                key={item}
                style={{ display: "inline-block", margin: "5px" }}
              >
                <input
                  type="checkbox"
                  id={item}
                  name={item}
                  checked={filteredBreeds.includes(item)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setFilteredBreeds((breeds: string[]) => [
                        ...breeds,
                        item,
                      ]);
                    } else {
                      const newArr = filteredBreeds.filter(
                        (item: string) => item !== e.target.name
                      );
                      setFilteredBreeds(newArr);
                    }
                  }}
                />
                <label htmlFor={item}>{item}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedsFilter;
