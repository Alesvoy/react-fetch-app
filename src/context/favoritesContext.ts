import { Dispatch, SetStateAction, createContext } from "react";
import { IDog } from "../types/dogs";

type FavoritesContextType = {
  favorites: IDog[];
  setFavorites: Dispatch<SetStateAction<IDog[]>>;
};

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  setFavorites: () => {},
});
