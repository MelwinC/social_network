import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { User as UserType } from "@/types/user";
import { Message } from "@/types/message";

interface MessageItemProps {
  message: Message;
  isMyMessage: boolean;
  sender: UserType | undefined;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isMyMessage,
  sender,
}) => {
  const serverUrl = import.meta.env.VITE_API_URL;
  const photoUrl = sender?.photo ? `${serverUrl}/${sender.photo}` : "";

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
      {!isMyMessage && (
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={photoUrl} />
            <AvatarFallback className="bg-primary-dark">
              {sender?.firstname?.substring(0, 1) || ""}
              {sender?.lastname?.substring(0, 1) || ""}
            </AvatarFallback>
          </Avatar>
          <div className="bg-primary-light p-2 rounded-md shadow-md text-black">
            <p className="text-sm font-semibold">{sender?.firstname}</p>
            <p className="text-xs text-gray-500">
              {new Date(message.createdAt).toLocaleString()}
            </p>
            <p>{message.content}</p>
          </div>
        </div>
      )}
      {isMyMessage && (
        <div className="bg-indigo-600 p-2 rounded-md shadow-md text-primary-light">
          <p className="text-xs text-gray-200">
            {new Date(message.createdAt).toLocaleString()}
          </p>
          <p>{message.content}</p>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
