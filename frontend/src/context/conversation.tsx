import useConfig from "@/hooks/useConfig";
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
  const { config } = useConfig();
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
          size: config.topKReturn.toString(),
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
      let text: string;
      if (config.diverseReply) {
        const response = await fetch("/api/reply", {
          method: "POST",
          body: JSON.stringify({
            conversation,
            images,
          }),
        });
        text = (await response.json()).reply;
        console.log(text);
      } else {
        text = "Here are the results just for you!";
      }
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
