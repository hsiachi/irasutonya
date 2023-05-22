import { Conversation } from "@/types/conversation";
import { createContext, useState } from "react";

type ConversationContextType = {
  conversation: Conversation;
  send: (text: string) => void;
};

const initConversationContext: ConversationContextType = {
  conversation: {
    id: "",
    messages: [
      {
        role: "bot",
        text: "Hi, what can I do for you today?",
      },
    ],
  },
  send: () => {},
};

export const ConversationContext = createContext<ConversationContextType>(
  initConversationContext
);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversation, setConversation] = useState<Conversation>(
    initConversationContext.conversation
  );
  const send = async (text: string) => {
    setConversation((conv) => ({
      ...conv,
      messages: [
        ...conv.messages,
        {
          role: "user",
          text,
        },
      ],
    }));
    const res = await fetch(
      "/api/search?" +
        new URLSearchParams({
          q: text,
          cid: conversation.id,
        }),
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      const msg =
        "Sorry, there's something wrong with me." + (await res.text());
      setConversation((conv) => ({
        ...conv,
        messages: [
          ...conv.messages,
          {
            role: "bot",
            text: msg,
          },
        ],
      }));
    } else {
      const data = await res.json();
      console.log(data.data.map((d: any) => d["image"]));
      setConversation((conv) => ({
        ...conv,
        messages: [
          ...conv.messages,
          {
            role: "bot",
            text: "Here's the result I got for you!",
            images: data.data.map((d: any) => d["image"]) as string[],
          },
        ],
      }));
    }
  };
  return (
    <ConversationContext.Provider value={{ conversation, send }}>
      {children}
    </ConversationContext.Provider>
  );
}
