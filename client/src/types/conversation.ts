import { Message } from "./message";
import { User } from "./user";

export type Conversation = {
  id: number;
  name: string;
  messages: Message[];
  users: User[];
}