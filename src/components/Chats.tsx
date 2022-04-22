import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";
import Loading from "../assets/loading.gif";
import { ChatProps, Message, User } from "../types/types";

const Chats: React.FC<ChatProps> = ({
  currentChat,
  socket,
  typing,
  onlineUsers,
}) => {
  const currentUser: any = localStorage.getItem("chat-app-current-user");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef: any = useRef();
  const [arrivalMessage, setArrivalMessage] = useState<Message>();
  const [useronline, setUserOnline] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const data: User = JSON.parse(currentUser);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(recieveMessageRoute, {
        from: data?._id,
        to: currentChat?._id,
      });
      setMessages(response.data);
    };
    getData();
  }, [currentChat]);

  const handleSendMsg = async (
    e: React.FormEvent<HTMLFormElement>,
    msg: string
  ) => {
    e.preventDefault();
    if (msg.length < 1) return;
    const today: Date = new Date();
    const time: string =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
      time: time,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
      time: time,
    });

    const msgs: Message[] = [...messages];
    msgs.push({ fromSelf: true, message: msg, time });
    setMessages(msgs);
    setMsg("");
    socket.current.emit("typing", {
      user: JSON.parse(currentUser),
      typing: false,
    });
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg: string) => {
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
    arrivalMessage &&
      setMessages((prev: Message[]) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    onlineUsers.filter((user: User) => {
      if (user._id === currentChat._id) {
        setUserOnline(true);
      } else {
        setUserOnline(false);
      }
    });
  }, [currentChat, onlineUsers]);

  return (
    <div>
      <div className="pl-4 pr-8 py-2 bg-bg_screen">
        <div className="p-8 bg-bg_screen shadow-card_shadow font-workSans rounded-modalRadius  h-[97vh] mb-5">
          <div className="flex flex-col justify-center bg-bg_button  rounded-xl shadow-button_shadow mb-6">
            <div className="flex mx-4  rounded-3xl items-center text-gray-700">
              <div className="bg-white ml-4 w-12 h-12 rounded-full flex justify-center items-center border-2 border-green-500 p-1">
                <img
                  className="rounded-full bg-blue-100"
                  src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="p-5">
                <h4 className="text-xl text-white">{currentChat?.username}</h4>

                {useronline ? (
                  <p className="text-green-600 text-xs">Online</p>
                ) : (
                  <p className="text-red-600 text-xs">Offline</p>
                )}
              </div>
            </div>
          </div>

          <div className="h-chatBody overflow-x-auto">
            <div className="mt-4">
              {messages.map((message: Message) => (
                <div key={uuidv4()}>
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
                            src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
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
                      <div className="ml-1">
                        <h4 className="text-gray-500 text-xs">
                          {message.time}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef}>
                {typing?.typing === true &&
                typing?.user?.username === currentChat?.username ? (
                  <div className="mb-3">
                    <div className={`flex mx-4 items-end  mb-4`}>
                      <div
                        className={`bg-white ml-4 w-8 h-8 rounded-full flex justify-center items-center border-2 m-1 shadow-xl`}
                      >
                        <img
                          className="rounded-full bg-blue-100"
                          src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
                          alt="avatar"
                        />
                      </div>
                      <div
                        className={`rounded-3xl max-w-[65%] text-sm shadow-button_shadow flex flex-wrap bg-indigo-400`}
                      >
                        <p
                          className={`ml-2 mr-2 font-medium p-3 w-[90%] text-white flex justify-center items-center `}
                          style={{
                            overflowWrap: "break-word",
                          }}
                        >
                          Typing&nbsp;
                          <img
                            src={Loading}
                            alt=""
                            width={20}
                            height={3}
                            className="mt-2"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 text-white">
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
                onKeyDown={(e) =>
                  socket.current.emit("typing", {
                    user: JSON.parse(currentUser),
                    typing: true,
                  })
                }
                onKeyUp={(e) => {
                  socket.current.emit("typing", {
                    user: JSON.parse(currentUser),
                    typing: false,
                  });
                }}
                onChange={(e) => {
                  setMsg(e.target.value);
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
