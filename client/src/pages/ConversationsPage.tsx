import { useCallback, useEffect, useState } from "react";
import { getMyConversations, leaveConversation } from "@/services/conversation";
import { Conversation } from "@/types/conversation";
import ConversationComponent from "@/components/ConversationComponent";
import Sidebar from "@/components/Sidebar";
import useAuth from "@/hooks/use-auth";
import { getUserIdFromToken } from "@/services/auth";
import socket from "@/services/socket";
import CreateConversationModal from "@/components/CreateConversationModal";

const ConversationsPage = () => {
  useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const conversationsData = await getMyConversations();
      if ("error" in conversationsData) {
        setError("Erreur lors du chargement des conversations.");
        setConversations([]);
      } else {
        const userId = getUserIdFromToken();
        const filteredConversations = conversationsData.filter(conversation => {
          if (conversation.users.length === 1 && conversation.users[0].id === userId) {
            leaveConversation(conversation.id);
            return false;
          }
          return true;
        });

        const sortedConversations = filteredConversations.map(conversation => ({
          ...conversation,
          messages: conversation.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        })).sort((a, b) => {
          const aLastMessageDate = new Date(a.messages[a.messages.length - 1]?.createdAt || 0);
          const bLastMessageDate = new Date(b.messages[b.messages.length - 1]?.createdAt || 0);
          return bLastMessageDate - aLastMessageDate;
        });

        setConversations(sortedConversations);
        setError(null);

        // Rejoindre toutes les conversations pour écouter les événements des sockets
        sortedConversations.forEach(conversation => {
          socket.emit("joinRoom", conversation.id);
        });

        // Sélectionner la conversation la plus récente par défaut
        if (sortedConversations.length > 0) {
          setSelectedConversation(sortedConversations[0]);
        }
      }
    } catch (e) {
      setError("Erreur inattendue lors du chargement des conversations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    socket.connect();
    fetchConversations();

    return () => {
      socket.disconnect();
    };
  }, [fetchConversations]);

  useEffect(() => {
    // Rejoindre toutes les conversations pour écouter les événements des sockets
    conversations.forEach(conversation => {
      socket.emit("joinRoom", conversation.id);
    });

    return () => {
      // Quitter toutes les conversations lors du démontage du composant
      conversations.forEach(conversation => {
        socket.emit("leaveRoom", conversation.id);
      });
    };
  }, [conversations]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleCreateConversation = () => {
    setIsModalOpen(true);
  };

  const updateConversation = (conversationId: number, newMessage: Message) => {
    setConversations((prevConversations) => {
      const updatedConversations = prevConversations.map((conversation) => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
          };
        }
        return conversation;
      });

      return updatedConversations.sort((a, b) => {
        const aLastMessageDate = new Date(a.messages[a.messages.length - 1]?.createdAt || 0);
        const bLastMessageDate = new Date(b.messages[b.messages.length - 1]?.createdAt || 0);
        return bLastMessageDate - aLastMessageDate;
      });
    });
  };

  const handleCreate = async (name: string, userIds: number[]) => {
    console.log(name, userIds);
    // Logique pour créer une nouvelle conversation
    // Vous pouvez appeler une API pour créer la conversation ici
    // Puis mettre à jour l'état des conversations
  };

  return (
    <div className="pb-16 md:pb-0 md:pt-16 h-full">
      {loading ? 
      <div>
        Loading...
      </div>
      :
      error ? 
      <div>{error}</div>
      :
      <div className="flex h-full">
        <div className="w-1/4 h-full border-r pt-4 flex justify-center mx-0">
          <Sidebar conversations={conversations} selectConversation={handleSelectConversation} createConversation={handleCreateConversation}/>
        </div>
        <div className="w-3/4">
            <ConversationComponent conversation={selectedConversation} updateConversation={updateConversation} />
        </div>
      </div>
      }
      <CreateConversationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
};

export default ConversationsPage;