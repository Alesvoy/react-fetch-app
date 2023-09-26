import { useContext } from "react";
import { IDog } from "../types/dogs";

import "./DogCard.css";
import { FavoritesContext } from "../context/favoritesContext";

type Props = {
  dogData: IDog;
};

const DogCard: React.FC<Props> = ({ dogData }) => {
  const { favorites, setFavorites } = useContext(FavoritesContext);

  const handleAddToFavorites = () => {
    const newFavorites = [...favorites, dogData];
    setFavorites(newFavorites);
  };

  const handleRemoveFormFavorites = () => {
    const newFavorites = favorites.filter((item) => item.id !== dogData.id);
    setFavorites(newFavorites);
  };
  return (
    <div className="dogCard">
      <img
        style={{ width: "250px", height: "250px", borderRadius: "10px" }}
        src={dogData.img}
      />
      <h3>{dogData.name}</h3>
      <p>Age: {dogData.age}</p>
      {favorites.includes(dogData) ? (
        <button className="btn" onClick={handleRemoveFormFavorites}>
          Remove from favorites
        </button>
      ) : (
        <button className="btn" onClick={handleAddToFavorites}>
          Add to favorites!
        </button>
      )}
    </div>
  );
};

export default DogCard;
