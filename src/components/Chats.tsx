import axios from "axios";
import React, { Ref, useEffect, useRef, useState } from "react";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

const Chats = (props: { currentChat: any; socket: any }) => {
  const [messages, setMessages] = useState<any>([]);
  const scrollRef: any = useRef();
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);

  const [msg, setMsg] = useState("");

  useEffect(() => {
    const getData = async () => {
      const user: any = await localStorage.getItem("chat-app-current-user");
      const data = JSON.parse(user);
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: props.currentChat?._id,
      });
      setMessages(response.data);
      console.log(">>>>__________________", response.data);
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

  const randomAvatarGenerator = () => {
    let avatars = `https://avatars.dicebear.com/api/avataaars/${Math.random()}.svg`;
    return avatars;
  };

  return (
    <div>
      <div className="pl-4 pr-12 py-5 bg-slate-200">
        <div className="p-8 bg-white font-workSans rounded-modalRadius shadow-lg">
          <div className="flex flex-col justify-center bg-green-100  rounded-modalRadius mb-6">
            <div className="flex mx-4 rounded rounded-3xl items-center text-gray-700">
              <div className="bg-white ml-4 w-16 h-16 rounded-full flex justify-center items-center border-2 border-green-500 p-1">
                <img
                  className="rounded-full bg-blue-100"
                  src={randomAvatarGenerator()}
                  alt="avatar"
                />
              </div>
              <div className="p-5">
                <h4 className="text-2xl">{props.currentChat?.username}</h4>
                <p className="text-green-600 ">Online</p>
              </div>
            </div>
          </div>

          <div className="h-chatBody overflow-x-auto">
            <div className="mt-4">
              {messages.map((message: any) => (
                <div key={uuidv4()} ref={scrollRef}>
                  <div className="mb-6">
                    <div
                      className={`flex mx-4 items-end ${
                        message.fromSelf ? "flex-row-reverse mx-4 mb-5" : "mb-4"
                      }`}
                    >
                      <div
                        className={`bg-white ml-4 w-12 h-12 rounded-full flex justify-center items-center border-2 p-1 shadow-xl ${
                          message.fromSelf
                            ? "border-gray-500"
                            : "border-blue-500"
                        }`}
                      >
                        <img
                          className="rounded-full bg-blue-100"
                          src={randomAvatarGenerator()}
                          alt="avatar"
                        />
                      </div>
                      <div
                        className={` rounded-full w-[65%] text-lg shadow-xl ${
                          message.fromSelf ? "bg-gray-300" : "bg-blue-400"
                        }`}
                      >
                        <p
                          className={`ml-5  font-medium p-6 ${
                            message.fromSelf ? "" : "text-white"
                          }`}
                        >
                          {message.message}
                        </p>
                      </div>
                      <div className="ml-5">
                        <h4 className="text-gray-700 text-xs">
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
                className="w-[95%] px-8 py-4 rounded rounded-xl  text-xl shadow-2xl outline-none bg-violet-600 text-white placeholder-white"
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
