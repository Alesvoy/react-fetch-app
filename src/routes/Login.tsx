import { useState } from "react";
import { LOGIN_URL } from "../utils/urls";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("alesvoy@gmail.com");
  const [name, setName] = useState("Alejandro");

  const navigate = useNavigate();

  const submitHandler = async (e: React.SyntheticEvent) => {
    try {
      e.preventDefault();
      await axios.post(
        LOGIN_URL,
        { name, email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("Log in successful!", {
        duration: 2000,
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/dogs");
      }, 2000);
    } catch (error) {
      toast.error("Oops something went wrong! Try again.", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="name" className="mr-3">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="mr-3">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Login;
