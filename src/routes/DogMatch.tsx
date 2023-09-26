import { useContext } from "react";
import { FavoritesContext } from "../context/favoritesContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getMatch } from "../api/dogs";
import "./DogMatch.css";
import toast from "react-hot-toast";

const DogMatch: React.FC = () => {
  const { favorites } = useContext(FavoritesContext);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["match", favorites],
    queryFn: () => {
      const favoriteIds = favorites.map((item) => item.id);
      return getMatch(favoriteIds);
    },
    onError: () => {
      toast.error("Unexpected Error, try again!");
      navigate("/dogs");
    },
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="dogMatch">
      <h1>You have a match!</h1>
      <img
        style={{ width: "200px", height: "200px" }}
        src={data?.data[0].img}
      />
      <h3>{data?.data[0].name}</h3>
      <p>Age: {data?.data[0].age}</p>
      <p>Zip Code: {data?.data[0].zip_code}</p>
      <button
        className="btn"
        onClick={() => {
          navigate("/dogs");
        }}
      >
        Match me to a new dog!
      </button>
    </div>
  );
};

export default DogMatch;
