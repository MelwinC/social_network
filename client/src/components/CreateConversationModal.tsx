import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFollows } from "@/services/follow";

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, userIds: number[]) => void;
}

const CreateConversationModal: React.FC<CreateConversationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [friends, setFriends] = useState<
    { id: number; firstname: string; lastname: string }[]
  >([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await getFollows();
      if (!("error" in response)) {
        setFriends(response);
      }
    };

    fetchFriends();
  }, []);

  const handleCreate = () => {
    onCreate(name, selectedUsers);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            label="Nom de la conversation"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la conversation"
          />
          <Select
            onValueChange={(value) =>
              setSelectedUsers([...selectedUsers, parseInt(value)])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner des amis" />
            </SelectTrigger>
            <SelectContent>
              {friends.map(
                (friend, index) =>
                  friend.firstname &&
                  friend.lastname && (
                    <SelectItem key={index} value={`${friend.id}`}>
                      {friend.firstname} {friend.lastname}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>
          <Button variant={"dark"} onClick={handleCreate}>Créer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateConversationModal;
