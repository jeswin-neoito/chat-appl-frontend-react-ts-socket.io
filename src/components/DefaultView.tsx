import ChatList from "./ChatList";
import Chats from "./Chats";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { User } from "../types/types";
import Welcome from "./Welcome";

const DefaultView = () => {
  const navigate = useNavigate();
  const socket: any = useRef();
  const [contacts, setContacts] = useState<any>([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    const getData = async () => {
      if (!localStorage.getItem("chat-app-current-user")) {
        navigate("/login");
      } else {
        const user: any = await localStorage.getItem("chat-app-current-user");
        setCurrentUser(JSON.parse(user));
      }
    };
    getData();
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser?._id);
    }
  }, [currentUser]);
  useEffect(() => {
    const getUser = async () => {
      if (currentUser) {
        const data: any = await axios.get(
          `${allUsersRoute}/${currentUser._id}`
        );
        console.log(">>>>>>>>>>", data);

        setContacts(data.data);
      }
    };
    getUser();
  }, [currentUser]);
  const handleChatChange = (chat: any) => {
    setCurrentChat(chat);
  };

  return (
    <div className="bg-slate-200 flex">
      <div className="w-[34%]">
        <ChatList contacts={contacts} changeChat={handleChatChange} />
      </div>
      <div className="w-[66%]">
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <Chats currentChat={currentChat} socket={socket} />
        )}
      </div>
    </div>
  );
};

export default DefaultView;
