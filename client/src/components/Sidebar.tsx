import React, { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Conversation } from "@/types/conversation";
import { truncateText } from "@/lib/utils";
import { getUserIdFromToken } from "@/services/auth";
import socket from "@/services/socket";

interface SidebarProps {
  conversations: Conversation[];
  selectConversation: (conversation: Conversation) => void;
  createConversation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectConversation,
  createConversation,
}) => {
  const userId = getUserIdFromToken();
  const [updatedConversations, setUpdatedConversations] = useState(conversations);
  const [typingStatuses, setTypingStatuses] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    setUpdatedConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setUpdatedConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation.id === newMessage.conversation_id) {
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
            };
          }
          return conversation;
        });

        // Trier les conversations par date du dernier message
        return updatedConversations.sort((a, b) => {
          const aLastMessageDate = new Date(a.messages[a.messages.length - 1]?.createdAt || 0);
          const bLastMessageDate = new Date(b.messages[b.messages.length - 1]?.createdAt || 0);
          return bLastMessageDate - aLastMessageDate;
        });
      });
    });

    socket.on("typing", (data) => {
      if (data.user.id !== userId) {
        setTypingStatuses((prevStatuses) => ({
          ...prevStatuses,
          [data.conversationId]: `${data.user.firstname || "Utilisateur"} est en train d'écrire...`,
        }));
      }
    });

    socket.on("stopTyping", (data) => {
      setTypingStatuses((prevStatuses) => {
        const newStatuses = { ...prevStatuses };
        delete newStatuses[data.conversationId];
        return newStatuses;
      });
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col w-full items-center">
      <div
        className="flex justify-center w-4/5 lg:3/5 gap-2 px-4 mb-4 xl:px-6 py-2 rounded-md bg-primary-light text-slate-800 hover:bg-indigo-600 hover:text-primary-light duration-500 hover:cursor-pointer"
        onClick={createConversation}
      >
        <PlusCircle />
        Créer une conversation
      </div>
      <div className="w-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
        {updatedConversations.map((conversation) => {
          const latestMessage =
            conversation.messages.length > 0
              ? conversation.messages[conversation.messages.length - 1]
              : null;

          const otherUsers = conversation.users.filter(user => user.id !== userId);

          return (
            <div
              key={conversation.id}
              onClick={() => selectConversation(conversation)}
              className="mt-2 w-full"
            >
              <div className="p-2 rounded-md mx-4 border-none text-slate-100 bg-ternary-dark hover:bg-primary-dark hover:cursor-pointer">
                <div className="flex justify-between">
                  <p className="text-lg">
                    {truncateText(
                      otherUsers
                        .map((user) => user.firstname || "Utilisateur")
                        .join(", "),
                      20
                    )}
                  </p>
                  <p>{latestMessage?.createdAt && formatDate(latestMessage.createdAt)}</p>
                </div>
                {typingStatuses[conversation.id] ? (
                  <div className="pt-2 text-gray-500">
                    {typingStatuses[conversation.id]}
                  </div>
                ) : latestMessage ? (
                  <div className="pt-2">
                    <p>{latestMessage.content}</p>
                  </div>
                ) : (
                  <div className="pt-1">
                    <p>Aucun message</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;