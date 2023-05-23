export type Message = {
  text: string;
  images?: { name: string; url: string }[];
  role: "user" | "bot";
};

export type Conversation = {
  id: string;
  messages: Message[];
};
