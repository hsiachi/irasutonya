import { ConversationContext } from "@/app/context";
import { useContext } from "react";

export default function useConversation(id?: string) {
  const { conversation, send } = useContext(ConversationContext);
  return { conversation, send };
}
