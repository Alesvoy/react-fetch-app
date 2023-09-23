import "./App.css";
import Login from "./routes/Login.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DogSearch from "./routes/DogSearch.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dogs",
    element: <DogSearch />,
  },
]);

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster />
    </>
  );
}

export default App;
