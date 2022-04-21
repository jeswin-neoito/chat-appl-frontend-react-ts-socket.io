import React, { useEffect, useState } from "react";
import { logoutRoute } from "../utils/APIRoutes";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatList = (props: {
  contacts: any;
  changeChat: any;
  onlineUsers: any;
}) => {
  const currentUser: any = localStorage.getItem("chat-app-current-user");
  const navigate = useNavigate();

  const [filterContacts, setFilterContacts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setFilterContacts(props.contacts);
  }, [props.contacts]);

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
  };

  const [currentSelected, setCurrentSelected] = useState(undefined);
  const changeCurrentChat = (index: any, contact: any) => {
    setCurrentSelected(index);
    props.changeChat(contact);
  };
  const handleLogout = async () => {
    const _id: any = localStorage.getItem("chat-app-current-user");
    const id = JSON.parse(_id).id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <div>
      <div className="px-8 py-1 bg-bg_screen">
        <div className="p-8 bg-bg_screen  font-workSans rounded-modalRadius shadow-card_shadow">
          <div className="flex flex-col justify-center items-center">
            <h3 className="font-semibold text-3xl py-11 text-indigo-500">
              Message
            </h3>
            <form
              action=""
              className="w-full flex flex-col justify-center items-center"
            >
              <input
                className="w-[95%] px-8 py-4 rounded-xl bg-bg_button text-xl font-light shadow-input_shadow outline-none text-gray-700 placeholder-gray-700"
                type="text"
                placeholder="Search Your Contacts"
                value={search}
                onChange={(e) => handleSearchChange(e)}
              />
            </form>
          </div>

          <div className="mt-6 w-[97%]">
            <h3 className="pl-5 text-2xl mb-3 font-semibold text-indigo-500">
              Active
              <span
                className={
                  props.onlineUsers.length > 0
                    ? "ml-2 font-medium text-green-600"
                    : "ml-2 text-black"
                }
              >
                ({props.onlineUsers.length})
              </span>
            </h3>
            <div className="flex overflow-x-auto max-w-full">
              {props.onlineUsers
                .filter((contact: any) => {
                  return contact.username !== JSON.parse(currentUser).username;
                })
                .map((contact: any) => (
                  <div key={contact._id}>
                    <div className="bg-bg_card min-w-circle h-20 rounded-full flex justify-center items-center shadow-xl border-2 border-green-500 p-1 mx-3">
                      <img
                        className="rounded-full bg-blue-100"
                        src={`data:image/svg+xml;base64,${contact?.avatarImage}`}
                        alt=""
                      />
                    </div>

                    <p className="text-xs ml-8">{contact.username}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="pl-5 text-2xl mb-3 font-semibold text-indigo-500">
              Contacts
              <span
                className={
                  filterContacts.length > 0
                    ? "ml-2 font-medium text-green-500"
                    : "ml-2 text-black"
                }
              >
                ({filterContacts.length})
              </span>
            </h3>
            <div className="flex flex-col w-full overflow-y-auto h-128">
              {filterContacts
                .filter((contact) => {
                  if (contact.username.includes(search)) {
                    return true;
                  }
                })
                .map((contact: any, index: any) => (
                  <div
                    key={contact._id}
                    className={`contact ${
                      index === currentSelected ? "selected" : ""
                    }`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className="flex bg-indigo-500 shadow-card_shadow mx-4 rounded-3xl items-center mb-4 min-h-chatList">
                      <div className="bg-white ml-4 min-w-circle h-20 rounded-full flex justify-center items-center border-2 border-blue-500 p-1">
                        <img
                          className="rounded-full bg-lime-200"
                          src={`data:image/svg+xml;base64,${contact?.avatarImage}`}
                          alt="avatar"
                        />
                      </div>
                      <div className="p-5">
                        <h4>{contact.username}</h4>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col w-full overflow-y-auto h-24">
              <div>
                <div className="flex items-center justify-between min-h-chatList">
                  <div className="bg-white min-w-circle h-20 rounded-full flex justify-center items-center border-2 border-blue-500 p-1">
                    <img
                      className="rounded-full bg-lime-200"
                      src={`data:image/svg+xml;base64,${
                        JSON.parse(currentUser)?.avatarImage
                      }`}
                      alt="avatar"
                    />
                  </div>
                  <div className="text-white">
                    <h1 className="text-lg font-bold">
                      {JSON.parse(currentUser)?.username}
                    </h1>
                  </div>
                  <div>
                    <button
                      className=" text-white font-bold"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
