import React, { useEffect, useState } from "react";
import { logoutRoute } from "../utils/APIRoutes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "../assets/switch.png";
import { ChatListProps, User } from "../types/types";

const ChatList: React.FC<ChatListProps> = ({
  contacts,
  changeChat,
  onlineUsers,
}) => {
  const currentUser: any = localStorage.getItem("chat-app-current-user");
  const navigate = useNavigate();

  const [filterContacts, setFilterContacts] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setFilterContacts(contacts);
  }, [contacts]);

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const [currentSelected, setCurrentSelected] = useState<number>();
  const changeCurrentChat = (index: number, contact: User) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  const handleLogout = async () => {
    const id: string = JSON.parse(currentUser)?.id;
    const data = await axios.get<null>(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <div>
      <div className="px-8 py-1 bg-bg_screen overflow-hidden">
        <div className="p-8 bg-bg_screen  font-workSans rounded-modalRadius shadow-card_shadow h-[97vh] mt-3">
          <div className="flex flex-col w-full overflow-y-auto h-24">
            <div>
              <div className="flex items-center justify-between min-h-chatList">
                <div className="bg-white min-w-circle h-12 rounded-full flex justify-center items-center border-2 border-blue-500 p-1">
                  <img
                    className="rounded-full bg-lime-200"
                    src={`data:image/svg+xml;base64,${
                      JSON.parse(currentUser)?.avatarImage
                    }`}
                    alt="avatar"
                  />
                </div>
                <div className="text-white">
                  <h3 className="font-semibold text-2xl py-5 text-indigo-500">
                    {JSON.parse(currentUser)?.username}
                  </h3>
                </div>
                <div>
                  <img
                    src={LogoutIcon}
                    alt="Logout"
                    width={25}
                    height={25}
                    onClick={handleLogout}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <form
              action=""
              className="w-full flex flex-col justify-center items-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="w-[95%] px-5 py-3 rounded-xl bg-bg_button text-xl font-light shadow-input_shadow outline-none text-white "
                type="text"
                placeholder="Search Your Contacts"
                value={search}
                onChange={(e) => handleSearchChange(e)}
              />
            </form>
          </div>

          <div className="mt-6 w-[97%]">
            <h3 className="pl-5 text-xl mb-3 font-semibold text-indigo-500">
              Active
              <span className="ml-2 font-medium text-green-600">
                (
                {
                  onlineUsers.filter((contact: User) => {
                    return (
                      contact.username !== JSON.parse(currentUser).username
                    );
                  }).length
                }
                )
              </span>
            </h3>
            <div className="flex overflow-x-auto max-w-full">
              {onlineUsers
                .filter((contact: User) => {
                  return contact.username !== JSON.parse(currentUser).username;
                })
                .map((contact: User) => (
                  <div key={contact._id}>
                    <div className="bg-bg_card min-w-[60px] h-15 rounded-full flex justify-center items-center shadow-xl border-2 border-green-500 p-1 mx-3">
                      <img
                        className="rounded-full bg-blue-100"
                        src={`data:image/svg+xml;base64,${contact?.avatarImage}`}
                        alt=""
                      />
                    </div>

                    <p className="text-xs ml-6 text-white">
                      {contact.username}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="pl-5 text-xl mb-3 font-semibold text-indigo-500">
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
            <div className="flex flex-col w-full overflow-y-auto h-[43vh]">
              {filterContacts
                .filter((contact) => {
                  if (contact.username.includes(search)) {
                    return true;
                  }
                })
                .map((contact: User, index: number) => (
                  <div
                    key={contact._id}
                    className={`contact ${
                      index === currentSelected ? "selected" : ""
                    }`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className="flex bg-indigo-500 shadow-card_shadow mx-2 rounded-3xl items-center mb-2 min-h-chatList">
                      <div className="bg-bg_button ml-4 min-w-circle h-12 rounded-full flex justify-center items-center border-2 border-blue-500 p-1">
                        <img
                          className="rounded-full bg-lime-200"
                          src={`data:image/svg+xml;base64,${contact?.avatarImage}`}
                          alt="avatar"
                        />
                      </div>
                      <div className="p-5">
                        <h4 className="text-l font-medium text-white">
                          {contact.username}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
