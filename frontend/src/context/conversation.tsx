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
        idx: 0,
        isLoading: false,
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
  function addMessage({
    text,
    role,
    isLoading,
  }: {
    text: string;
    role: "bot" | "user";
    isLoading: boolean;
  }) {
    setConversation((conv) => ({
      ...conv,
      messages: [
        ...conv.messages,
        {
          idx: conv.messages.length,
          role,
          text,
          isLoading,
        },
      ],
    }));
  }

  function updateLastMessage({
    text,
    images,
    isLoading,
  }: {
    text: string;
    images?: { name: string; url: string }[];
    isLoading: boolean;
  }) {
    setConversation((conv) => ({
      ...conv,
      messages: conv.messages.map((msg, i) => {
        if (i != conv.messages.length - 1) return msg;
        return {
          ...msg,
          text,
          images,
          isLoading,
        };
      }),
    }));
  }

  const { config } = useConfig();
  const send = async (text: string) => {
    addMessage({ text, role: "user", isLoading: false });
    addMessage({ text: "", role: "bot", isLoading: true });
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
      updateLastMessage({ text: msg, isLoading: false });
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
      updateLastMessage({ text, images, isLoading: false });
    }
  };
  return (
    <ConversationContext.Provider value={{ conversation, send }}>
      {children}
    </ConversationContext.Provider>
  );
}
