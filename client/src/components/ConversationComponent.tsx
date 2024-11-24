import { Conversation } from "@/types/conversation";
import { useEffect, useRef, useState } from "react";
import { Send, User, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./input";
import { getUserIdFromToken } from "@/services/auth";
import { capitalize } from "@/lib/utils";
import { User as UserType } from "@/types/user";
import { createMessage } from "@/services/message";
import socket from "@/services/socket";
import { Message } from "@/types/message";
import MessageItem from "./MessageItem";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationProps {
  conversation: Conversation | null;
  updateConversation: (conversationId: number, newMessage: Message) => void;
}

const ConversationComponent: React.FC<ConversationProps> = ({
  conversation,
  updateConversation,
}) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<UserType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sortMessagesByDate = (messages: Message[]) => {
    return messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  useEffect(() => {
    if (conversation) {
      setMessages(sortMessagesByDate(conversation.messages));

      socket.on("message", (newMessage) => {
        if (newMessage.conversation_id === conversation.id) {
          setMessages((prevMessages) => {
            const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
            if (messageExists) {
              return prevMessages;
            }
            return sortMessagesByDate([...prevMessages, newMessage]);
          });
        }
      });

      socket.on("typing", (data) => {
        if (data.conversationId === conversation.id && data.user.id !== getUserIdFromToken()) {
          setTypingUsers((prevTypingUsers) => {
            if (!prevTypingUsers.some(user => user.id === data.user.id)) {
              return [...prevTypingUsers, data.user];
            }
            return prevTypingUsers;
          });
        }
      });

      socket.on("stopTyping", (data) => {
        if (data.conversationId === conversation.id) {
          setTypingUsers((prevTypingUsers) => {
            return prevTypingUsers.filter(user => user.id !== data.user.id);
          });
        }
      });

      return () => {
        socket.off("message");
        socket.off("typing");
        socket.off("stopTyping");
      };
    }
  }, [conversation]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div>Aucune conversation n'est sélectionné.</div>
    );
  }

  const currentUser = conversation.users.find(
    (user) => user.id === getUserIdFromToken()
  );
  const otherUsers = conversation.users.filter(
    (user) => user.id !== currentUser?.id
  );
  const isGroup = otherUsers.length > 1;
  const conversationName =
    conversation.name ||
    otherUsers.map((user) => `${user.firstname || "Utilisateur"}`).join(", ");

  const findSender = (userId: number, users: UserType[]): UserType | undefined => {
    const sender = users.find((user) => user.id === userId);
    return sender;
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage = await createMessage(message, conversation.id);
    if ("error" in newMessage) {
      console.error(newMessage.error);
      return;
    }

    socket.emit("message", newMessage);
    updateConversation(conversation.id, newMessage);

    setMessages((prevMessages) => {
      const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
      if (messageExists) {
        return prevMessages;
      }
      return sortMessagesByDate([...prevMessages, newMessage]);
    });
    setMessage("");
    socket.emit("stopTyping", { conversationId: conversation.id, user: currentUser });
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    } else {
      socket.emit("typing", { conversationId: conversation.id, user: currentUser });
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { conversationId: conversation.id, user: currentUser });
      typingTimeoutRef.current = null;
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  const serverUrl = import.meta.env.VITE_API_URL;

  const getSenderPhoto = (sender: UserType | undefined) => {
    if (!sender) return "";
    return sender.photo ? `${serverUrl}/${sender.photo}` : "";
  }

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        {/* header */}
        <div className="flex items-center p-2 border-b border-primary-dark">
          {isGroup ? (
            <Users className="w-8 h-8" />
          ) : (
            otherUsers[0] && otherUsers[0].photo ? (
              <Avatar>
                <AvatarImage src={getSenderPhoto(otherUsers[0])} />
                <AvatarFallback className="bg-primary-dark">{capitalize((otherUsers[0].firstname?.substring(0, 1) || "")) + capitalize((otherUsers[0].lastname?.substring(0, 1) || ""))}</AvatarFallback>
              </Avatar>
            ) : (
              <User className="w-8 h-8" />
            )
          )}
          <div className="ml-2">{conversationName}</div>
        </div>

        {/* main */}
        <div className="messages-container h-full p-4">
          {messages.length === 0 ? (
            <div>Aucun message dans cette conversation.</div>
          ) : (
            <div className="flex flex-col space-y-4">
              {messages.map((msg) => {
                const isMyMessage = msg.user_id === currentUser?.id;
                return (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    isMyMessage={isMyMessage}
                    sender={findSender(msg.user_id, conversation.users)}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* typing status */}
        {typingUsers.length > 0 && (
          <div className="text-gray-500 p-2">
            {typingUsers.map(user => user.firstname || "Utilisateur").join(", ")} est en train d'écrire...
          </div>
        )}

        {/* input */}
        <form onSubmit={handleSubmit} className="flex bg-purple-500">
          <div className="w-full">
            <Input
              label="Message"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              id="message"
              type="text"
              value={message}
              className="rounded-none"
            />
          </div>
          <Button
            type="submit"
            variant="dark"
            className="rounded-none flex justify-center items-center h-full"
          >
            <Send />
          </Button>
        </form>
      </div>
    </>
  );
};

export default ConversationComponent;