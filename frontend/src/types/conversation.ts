export type Message = {
  idx: number;
  text: string;
  images?: { name: string; url: string }[];
  role: "user" | "bot";
  isLoading: boolean;
};

export type Conversation = {
  id: string;
  messages: Message[];
};
