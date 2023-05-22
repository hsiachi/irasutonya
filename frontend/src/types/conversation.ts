export type Message = {
  text: string;
  images?: string[];
  role: "user" | "bot";
};

export type Conversation = {
  id: string;
  messages: Message[];
};
