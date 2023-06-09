"use client";

import Image from "next/image";
import Input from "./input";
import Message from "./message";
import { ConversationProvider } from "../context/conversation";
import useConversation from "@/hooks/useConversation";
import { useEffect, useRef } from "react";
import { ConfigProvider } from "@/context/config";
import { Popover, Transition } from "@headlessui/react";
import useConfig from "@/hooks/useConfig";
import classNames from "classnames";

function Conversation() {
  const { conversation } = useConversation();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [ref, conversation]);
  return (
    <div className="flex-1 overflow-auto scrollbar-hidden">
      {conversation.messages.map((msg, i) => (
        <Message msg={msg} key={i} />
      ))}
      <div className="float-left clear-both" ref={ref} />
    </div>
  );
}

function ClearConversationButton() {
  const { clear } = useConversation();
  return (
    <Image
      src="/images/refresh.png"
      width="40"
      height="40"
      alt="settings"
      className="h-10 w-10 transition hover:cursor-pointer hover:rotate-45 hover:scale-110"
      onClick={() => clear()}
    />
  );
}

function SwitchItem({
  text,
  items,
}: {
  text: string;
  items: { text: string; isActive?: boolean; action?: () => void }[];
}) {
  return (
    <div className="px-2 py-1 flex items-center">
      <div className="text-sm w-28">{text}</div>
      <div className="flex gap-1 hover:cursor-default">
        {items.map((item, key) => {
          if (item.text === "/") return <span key={key}>/</span>;
          return (
            <span
              className={classNames(
                item.isActive
                  ? " underline underline-offset-4"
                  : "hover:cursor-pointer text-gray-400 transition hover:scale-110"
              )}
              onClick={() => {
                if (!item.isActive && item.action) item.action();
              }}
              key={key}
            >
              {item.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function RephraseItem() {
  const { config, setRephrase } = useConfig();
  const items = [
    { text: "On", isActive: config.rephrase, action: () => setRephrase(true) },
    { text: "/" },
    {
      text: "Off",
      isActive: !config.rephrase,
      action: () => setRephrase(false),
    },
  ];
  return <SwitchItem text="Rephrase" items={items} />;
}

function DiverseReplyItem() {
  const { config, setDiverseReply } = useConfig();
  const items = [
    {
      text: "On",
      isActive: config.diverseReply,
      action: () => setDiverseReply(true),
    },
    { text: "/" },
    {
      text: "Off",
      isActive: !config.diverseReply,
      action: () => setDiverseReply(false),
    },
  ];
  return <SwitchItem text="Diversity" items={items} />;
}

function TopKReturnItem() {
  const { config, setTopKReturn } = useConfig();
  return (
    <div className="px-2 py-1 flex items-center">
      <div className="text-sm w-28 flex-shrink-0">Top-K</div>
      <div>
        <input
          type="number"
          className="w-16"
          value={config.topKReturn}
          max={10}
          min={1}
          onChange={(e) => setTopKReturn(e.target.valueAsNumber)}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ConfigProvider>
      <ConversationProvider>
        <main className="flex h-screen flex-col items-center justify-between md:px-12">
          <div className="h-full overflow-hidden px-12 my-12 max-w-4xl relative flex flex-col flex-1 justify-between container rounded-3xl bg-white">
            <div className="relative text-center py-8">
              <div className="absolute left-0 inset-y-0 h-full flex items-center">
                <ClearConversationButton />
              </div>
              <h1
                className={`text-6xl font-bold font-handwriting relative inline`}
              >
                irasutonya
                <Image
                  src="/images/cat_fish_run.png"
                  alt="search"
                  width="60"
                  height="60"
                  className="absolute right-0 top-0 -mr-16 transition hover:scale-110 hover:-rotate-12 hover:translate-x-2 hover:-translate-y-2"
                />
              </h1>
              <Popover
                as="div"
                className="absolute right-0 inset-y-0 h-full text-left flex items-center"
              >
                {({ open }) => (
                  <div className="relative">
                    <Popover.Button className="outline-0 active:outline-0">
                      <Image
                        src="/images/haguruma_gear1_silver.png"
                        width="40"
                        height="40"
                        alt="settings"
                        className={classNames(
                          open ? "rotate-45 scale-110" : "",
                          "h-10 w-10 transition hover:cursor-pointer"
                        )}
                      />
                    </Popover.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Popover.Panel className="font-mono px-1 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-400 rounded-lg bg-white border-4 border-amber-600 shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <RephraseItem />
                        <DiverseReplyItem />
                        <TopKReturnItem />
                      </Popover.Panel>
                    </Transition>
                  </div>
                )}
              </Popover>
            </div>
            <Conversation />

            <Input />
          </div>
          <div className="font-mono text-gray-600 pb-4 flex gap-1 justify-center">
            <a
              href="https://github.com/hsiachi/irasutonya"
              className="underline underline-offset-4 hover:cursor-pointer"
            >
              GitHub
            </a>
            |
            <div>
              Credits to{" "}
              <a
                href="https://www.irasutoya.com"
                className="underline underline-offset-4 hover:cursor-pointer"
              >
                Irasutoya
              </a>
            </div>
          </div>
        </main>
      </ConversationProvider>
    </ConfigProvider>
  );
}
