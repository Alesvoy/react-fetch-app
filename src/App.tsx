import { useState } from "react";
import Login from "./routes/Login.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DogSearch from "./routes/DogSearch.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import DogMatch from "./routes/DogMatch.tsx";
import { IDog } from "./types/dogs.ts";
import { FavoritesContext } from "./context/favoritesContext.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dogs",
    element: <DogSearch />,
  },
  {
    path: "/match",
    element: <DogMatch />,
  },
]);

function App() {
  const queryClient = new QueryClient();
  const [favorites, setFavorites] = useState<IDog[]>([]);

  return (
    <>
      <FavoritesContext.Provider value={{ favorites, setFavorites }}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </FavoritesContext.Provider>
      <Toaster />
    </>
  );
}

export default App;
