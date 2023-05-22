"use client";

import useConversation from "@/hooks/useConversation";
import Image from "next/image";
import { useState } from "react";

export default function Input() {
  const [text, setText] = useState("");
  const { send } = useConversation();
  const onSubmit = () => {
    if (text === "") {
      return;
    }
    send(text);
    setText("");
  };
  return (
    <div className="w-full p-8 flex">
      <div className="flex-1 mx-4 relative">
        <input
          type="text"
          className="w-full caret-gray-600 focus:outline-0 px-2 -py-2 font-handwriting text-4xl text-gray-600"
          placeholder="Click here to search..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
        />
      </div>

      <button
        onClick={() => onSubmit()}
        className="rounded-lg -mb-2 p-2 font-handwriting hover:cursor-pointer transition hover:rotate-12"
      >
        <Image
          src="/images/airplane6_blue.png"
          alt="search"
          width="80"
          height="80"
        />
      </button>
    </div>
  );
}
