import axios from "axios";
import { DOG_BREEDS, DOG_SEARCH, GET_MATCH, POST_DOGS } from "../utils/urls";

export const getDogs = async (page: number, breeds: string[], sort: string) => {
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

export const getBreeds = async () => {
  return axios.get(DOG_BREEDS, { withCredentials: true });
};

export const getMatch = async (favorites: string[]) => {
  const dogId = await axios.post(GET_MATCH, favorites, {
    withCredentials: true,
  });

  return axios.post(POST_DOGS, [dogId.data.match], {
    withCredentials: true,
  });
};
