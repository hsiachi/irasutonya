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
      const images = data.data.map((d: any) => ({
        name: d["name"],
        url: d["image"],
      }));
      const response = await fetch("/api/reply", {
        method: "POST",
        body: JSON.stringify({
          conversation,
          images,
        }),
      });
      const text = (await response.json()).reply;
      console.log(text);
      setConversation((conv) => ({
        ...conv,
        messages: [
          ...conv.messages,
          {
            role: "bot",
            text: text,
            images: images,
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
