import { useState } from "react";
import { LOGIN_URL } from "../utils/urls";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

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
      }, 1000);
    } catch (error) {
      toast.error("Oops something went wrong! Try again.", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="login">
      <form className="loginForm" onSubmit={submitHandler}>
        <div>
          <label htmlFor="name" className="formLabel">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="Jane Smith"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="formLabel">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn" type="submit">
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
