import useConfig from "@/hooks/useConfig";
import { Conversation } from "@/types/conversation";
import { createContext, useState } from "react";

type ConversationContextType = {
  conversation: Conversation;
  send: (text: string) => void;
  clear: () => void;
};

const initConversation: Conversation = {
  id: "",
  messages: [
    {
      role: "bot",
      text: "Hi, Welcome to Irasutonya, a website to search for pictures with natural languages! what can I do for you today?",
      isLoading: false,
    },
  ],
};

const initConversationContext: ConversationContextType = {
  conversation: initConversation,
  send: () => {},
  clear: () => {},
};

export const ConversationContext = createContext<ConversationContextType>(
  initConversationContext
);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversation, setConversation] =
    useState<Conversation>(initConversation);
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
    // conversation might not be updated,
    // so we have to copy manually.
    // TODO: find a better way to cope with it
    let convCopy = JSON.parse(JSON.stringify(conversation)) as Conversation;
    convCopy = {
      ...convCopy,
      messages: [
        ...convCopy.messages,
        {
          text,
          role: "user",
          isLoading: false,
        },
      ],
    };
    addMessage({ text, role: "user", isLoading: false });
    addMessage({ text: "", role: "bot", isLoading: true });
    let query: string;
    if (config.rephrase) {
      try {
        query = (
          await (
            await fetch("/api/rephrase", {
              method: "POST",
              body: JSON.stringify({
                conversation: convCopy,
              }),
            })
          ).json()
        )["query"];
        console.log("query: ", query);
      } catch (e) {
        console.log(e);
        console.log("Use default query");
        query = text;
      }
    } else {
      query = text;
    }
    const res = await fetch(
      "/api/search?" +
        new URLSearchParams({
          q: query,
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
        try {
          const response = await fetch("/api/reply", {
            method: "POST",
            body: JSON.stringify({
              conversation: convCopy,
              images,
            }),
          });
          text = (await response.json()).reply;
          console.log(text);
        } catch (e) {
          console.log(e);
          text = "Here are the results just for you!";
        }
      } else {
        text = "Here are the results just for you!";
      }
      updateLastMessage({ text, images, isLoading: false });
    }
  };
  const clear = () => {
    setConversation(initConversation);
  };
  return (
    <ConversationContext.Provider value={{ conversation, send, clear }}>
      {children}
    </ConversationContext.Provider>
  );
}
