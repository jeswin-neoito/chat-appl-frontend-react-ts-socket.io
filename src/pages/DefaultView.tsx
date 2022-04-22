import ChatList from "../components/ChatList";
import Chats from "../components/Chats";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { User, UserTyping } from "../types/types";
import Welcome from "../components/Welcome";

const DefaultView = () => {
  const navigate = useNavigate();
  const socket = useRef<any>();
  const [contacts, setContacts] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [currentChat, setCurrentChat] = useState<User>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [typing, setTyping] = useState<UserTyping | undefined>();

  useEffect(() => {
    if (!localStorage.getItem("chat-app-current-user")) {
      navigate("/login");
    } else {
      const user: any = localStorage.getItem("chat-app-current-user");
      setCurrentUser(JSON.parse(user));
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.on("usertyping", setUserTyping);
    }
  }, [currentUser]);
  const setUserTyping = (data: UserTyping) => {
    setTyping(data);
  };
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.on("online-users", onlineusers);
    }
  }, [currentUser]);
  const onlineusers = (users: User[]) => {
    setOnlineUsers(users);
  };
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  useEffect(() => {
    const getUser = async () => {
      if (currentUser) {
        const data = await axios.get<User[]>(
          `${allUsersRoute}/${currentUser._id}`
        );
        setContacts(data.data);
      }
    };
    getUser();
  }, [currentUser]);
  const handleChatChange = (chat: User) => {
    setCurrentChat(chat);
  };

  useEffect(() => {
    const setAvatar = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    setAvatar();
  }, [currentUser]);

  return (
    <div className="bg-bg_screen flex">
      <div className="w-[34%]">
        <ChatList
          contacts={contacts}
          changeChat={handleChatChange}
          onlineUsers={onlineUsers}
        />
      </div>
      <div className="w-[66%]">
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <Chats
            currentChat={currentChat}
            socket={socket}
            typing={typing}
            onlineUsers={onlineUsers}
          />
        )}
      </div>
    </div>
  );
};

export default DefaultView;
