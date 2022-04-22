import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions: any = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("chat-app-current-user")) {
      navigate("/");
    }
  }, []);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
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
          className="bg-transparent p-4 text-white w-[100%] text-base  focus:outline-none rounded-xl shadow-input_shadow"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => handleChange(e)}
          className="bg-transparent p-4 text-white w-[100%] text-base  focus:outline-none rounded-xl shadow-input_shadow"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
          className="bg-transparent p-4 text-white w-[100%] text-base  focus:outline-none rounded-xl shadow-input_shadow"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={(e) => handleChange(e)}
          className="bg-transparent p-4 text-white w-[100%] text-base  focus:outline-none rounded-xl shadow-input_shadow"
        />
        <button
          type="submit"
          className=" text-indigo-500 p-4 font-bold border-none cursor-pointer rounded-lg uppercase shadow-button_shadow hover:shadow-button_shadow_hover"
        >
          Create User
        </button>
        <span className="text-white uppercase ">
          Already have an account ?{" "}
          <Link to="/login" className="text-indigo-700 font-bol4 ">
            Login.
          </Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}
