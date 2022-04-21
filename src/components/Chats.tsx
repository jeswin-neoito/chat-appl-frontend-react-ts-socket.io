import axios from "axios";
import React, { Ref, useEffect, useRef, useState } from "react";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

const Chats = (props: { currentChat: any; socket: any }) => {
  const currentUser: any = localStorage.getItem("chat-app-current-user");
  const [messages, setMessages] = useState<any>([]);
  const scrollRef: any = useRef();
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);

  const [msg, setMsg] = useState("");

  useEffect(() => {
    const getData = async () => {
      const user: any = localStorage.getItem("chat-app-current-user");
      const data = JSON.parse(user);
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: props.currentChat?._id,
      });
      setMessages(response.data);
    };
    getData();
  }, [props.currentChat]);

  // useEffect(() => {
  //   const getCurrentChat = async () => {
  //     const user: any = await localStorage.getItem("chat-app-current-user");
  //     const data = JSON.parse(user);
  //     if (props.currentChat) {
  //       data._id;
  //     }
  //   };
  //   getCurrentChat();
  // }, [props.currentChat]);

  const handleSendMsg = async (e: any, msg: any) => {
    e.preventDefault();
    const user: any = localStorage.getItem("chat-app-current-user");
    const data = JSON.parse(user);
    const today = new Date();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    props.socket.current.emit("send-msg", {
      to: props.currentChat._id,
      from: data._id,
      msg,
      time: time,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: props.currentChat._id,
      message: msg,
      time: time,
    });

    const msgs: any = [...messages];
    msgs.push({ fromSelf: true, message: msg, time });
    setMessages(msgs);
    setMsg("");
  };
  useEffect(() => {
    if (props.socket.current) {
      props.socket.current.on("msg-recieve", (msg: any) => {
        const today = new Date();
        const time =
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        setArrivalMessage({ fromSelf: false, message: msg, time });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev: any) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const randomAvatarGenerator = () => {
  //   let avatars = `https://avatars.dicebear.com/api/avataaars/${Math.random()}.svg`;
  //   return avatars;
  // };

  return (
    <div>
      <div className="pl-4 pr-8 py-2 bg-bg_screen">
        <div className="p-8 bg-bg_screen shadow-card_shadow font-workSans rounded-modalRadius  h-[97vh] mb-5">
          <div className="flex flex-col justify-center bg-bg_button  rounded-xl shadow-button_shadow mb-6">
            <div className="flex mx-4  rounded-3xl items-center text-gray-700">
              <div className="bg-white ml-4 w-12 h-12 rounded-full flex justify-center items-center border-2 border-green-500 p-1">
                <img
                  className="rounded-full bg-blue-100"
                  src={`data:image/svg+xml;base64,${props.currentChat?.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="p-5">
                <h4 className="text-xl text-white">
                  {props.currentChat?.username}
                </h4>
                <p className="text-green-600 text-xs">Online</p>
              </div>
            </div>
          </div>

          <div className="h-chatBody overflow-x-auto">
            <div className="mt-4">
              {messages.map((message: any) => (
                <div key={uuidv4()} ref={scrollRef}>
                  <div className="mb-3">
                    <div
                      className={`flex mx-4 items-end ${
                        message.fromSelf ? "flex-row-reverse mx-4 mb-5" : "mb-4"
                      }`}
                    >
                      <div
                        className={`bg-white ml-4 w-8 h-8 rounded-full flex justify-center items-center border-2 m-1 shadow-xl`}
                      >
                        {message.fromSelf ? (
                          <img
                            className="rounded-full bg-blue-100"
                            src={`data:image/svg+xml;base64,${
                              JSON.parse(currentUser)?.avatarImage
                            }`}
                            alt="avatar"
                          />
                        ) : (
                          <img
                            className="rounded-full bg-blue-100"
                            src={`data:image/svg+xml;base64,${props.currentChat?.avatarImage}`}
                            alt="avatar"
                          />
                        )}
                      </div>
                      <div
                        className={`rounded-3xl max-w-[65%] text-sm shadow-button_shadow flex flex-wrap ${
                          message.fromSelf ? "bg-bg_button" : "bg-indigo-400"
                        }`}
                      >
                        <p
                          className={`ml-2 mr-2 font-medium p-3 w-[90%] ${
                            message.fromSelf ? "text-white" : "text-white"
                          }`}
                          style={{
                            overflowWrap: "break-word",
                          }}
                        >
                          {message.message}
                        </p>
                      </div>
                      <div className="ml-5">
                        <h4 className="text-gray-500 text-xs">
                          {message.time}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-white">
            <form
              onSubmit={(e) => handleSendMsg(e, msg)}
              action=""
              className="w-full flex flex-col justify-center items-center"
            >
              <input
                className="w-[95%] px-5 py-3  rounded-xl  text-sm shadow-input_shadow outline-none bg-bg_button text-white placeholder-white"
                type="text"
                placeholder="Type Your Message Here "
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
