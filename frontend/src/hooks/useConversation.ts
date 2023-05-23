import { ConversationContext } from "@/context/conversation";
import { useContext } from "react";

export default function useConversation(id?: string) {
  const { conversation, send, clear } = useContext(ConversationContext);
  return { conversation, send, clear };
}
