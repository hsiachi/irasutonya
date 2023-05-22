"use client";

import Image from "next/image";
import Input from "./input";
import Message from "./message";
import { ConversationProvider } from "./context";
import useConversation from "@/hooks/useConversation";

function Conversation() {
  const { conversation } = useConversation();
  return (
    <>
      {conversation.messages.map((msg, i) => (
        <Message msg={msg} key={i} />
      ))}
    </>
  );
}

export default function Home() {
  return (
    <ConversationProvider>
      <main className="flex h-screen flex-col items-center justify-between px-12 py-24 md:px-12">
        <div className="max-w-4xl relative flex flex-col justify-between h-full container rounded-3xl bg-white">
          <div className="relative text-center py-8">
            <h1
              className={`text-6xl font-bold font-handwriting relative inline`}
            >
              irasutoya
              <Image
                src="/images/cat_fish_run.png"
                alt="search"
                width="60"
                height="60"
                className="absolute right-0 top-0 -mr-16"
              />
            </h1>
          </div>
          <div className="flex-1 overflow-auto">
            <Conversation />
          </div>
          <div className="">
            <Input />
          </div>
        </div>
      </main>
    </ConversationProvider>
  );
}
