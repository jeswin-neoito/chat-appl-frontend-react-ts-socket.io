import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  global.Buffer = Buffer;
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions: any = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-current-user")) navigate("/login");
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const userdata: any = localStorage.getItem("chat-app-current-user");
      const user = JSON.parse(userdata);

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-current-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data: any = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    getData();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="bg-bg_screen h-screen flex items-center justify-center gap-12">
          <img src={loader} alt="loader" />
        </div>
      ) : (
        <div className="bg-bg_screen h-screen flex flex-col items-center justify-center gap-12">
          <div>
            <h1 className="text-white text-2xl font-bold">
              Pick an Avatar as your profile picture
            </h1>
          </div>
          <div className="flex">
            {avatars.map((avatar: any, index: any) => {
              return (
                <div
                  className={`p-2 rounded-full flex justify-center items-center ${
                    selectedAvatar === index ? "border-2 border-indigo-600" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                    className="h-24"
                  />
                </div>
              );
            })}
          </div>
          <button
            onClick={setProfilePicture}
            className="bg-bg_button shadow-button_shadow hover:shadow-button_shadow_hover text-indigo-500 uppercase px-9 py-4 rounded-lg"
          >
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
