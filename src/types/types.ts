export interface User {
  avatarImage: string;
  email: string;
  isAvatarImageSet: boolean;
  password: string;
  username: string;
  __v: number;
  _id: string;
}

export interface UserTyping {
  typing: boolean;
  user: User;
}

// export interface Message {
//   message: string;
//   users: User[];
//   sender: string;
//   time: string;
// }

export interface Message {
  fromSelf: boolean;
  message: string;
  time: string;
}

export type ChatListProps = {
  contacts: User[];
  changeChat: any;
  onlineUsers: User[];
};

export type ChatProps = {
  currentChat: User;
  socket: any;
  typing: UserTyping | undefined;
  onlineUsers: User[];
};
