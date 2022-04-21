import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions: any = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem("chat-app-current-user")) {
      navigate("/");
    }
  }, []);

  const handleChange = (event: any) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          "chat-app-current-user",
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center gap-4 items-center bg-bg_screen ">
      <form
        action=""
        onSubmit={(event) => handleSubmit(event)}
        className="flex flex-col gap-8 bg-bg_button shadow-card_shadow rounded-3xl  p-20"
      >
        <div className="flex items-center gap-4 justify-center">
          <h1 className="text-white uppercase text-2xl font-bold">Chat App</h1>
        </div>
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={(e) => handleChange(e)}
          min="3"
          className="bg-transparent p-4 text-white w-[100%] text-base  focus:outline-none rounded-xl shadow-input_shadow"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
          className="bg-transparent p-4 text-white w-[100%] text-base  focus:outline-none rounded-xl shadow-input_shadow"
        />
        <button
          type="submit"
          className=" text-indigo-500 p-4 font-bold border-none cursor-pointer rounded-lg uppercase shadow-button_shadow hover:shadow-button_shadow_hover"
        >
          Log In
        </button>
        <span className="text-white uppercase ">
          Don't have an account ?{" "}
          <Link to="/register" className="text-indigo-700 font-bol4 ">
            Create One.
          </Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}
