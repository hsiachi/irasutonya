import { Conversation } from "@/types/conversation";
import { Configuration, OpenAIApi } from "openai";

const botReplyPrompt = `
The following is a conversation between a human and a cat robot.
The human is searching for pictures.
Assume that the robot is a staff of "Irasutoya", a Japanese website that provides free illustrations.
Your task is to write a reply for the robot in a lovely way, with some Japanese elements.
You will be provided with the conversation history and the searched image's description.
Your reply should be in English.
You should only complete the conversation, and output nothing else.
Here's an example:
[user] I want a picture of a cat.
[image] 猫の模様のイラスト（茶トラ）, 伸びをしている猫のイラスト, エキゾチックショートヘアのイラスト（猫）, 猫の模様のイラスト（茶白）, いろいろな表情の猫のイラスト「笑顔」
[bot] Here're some cute nekos I get for you!
[user] That's what I need. Thank you!
[bot] You're welcome nya~
    
`;

const rephrasePrompt = `
The following is a conversation between a human and a cat robot.
The human is searching for pictures.
Assume that the robot is a staff of "Irasutoya", a Japanese website that provides free illustrations.
Your task is to rephrase the conversation into a proper search query, which would be used to search for images.
You should only output the query, and nothing else.
The query should be concise and accurate.
Here's an example:
[user] I want a picture of a running cat.
[bot] Here're some pictures of running cats.
[user] Maybe two cats in the image?
[output] two running cats

`;

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

function convertImagesToPrompt(images: { name: string; url: string }[]) {
  return "[image] " + images.map((img) => img.name).join(", ");
}

function convertConversationToPrompt(
  conversation: Conversation,
  { useLast, noImage }: { useLast?: boolean; noImage?: boolean } = {
    useLast: false,
    noImage: false,
  }
) {
  let start, end: number | undefined;
  if (useLast) {
    start = conversation.messages.length - 1;
    end = start + 1;
  }
  return conversation.messages
    .slice(start, end)
    .map((msg) => {
      let m = `[${msg.role}] ${msg.text}`;
      if (!noImage && msg.images) {
        m += "\n" + convertImagesToPrompt(msg.images);
      }
      return m;
    })
    .join("\n");
}

export async function getBotReply(
  conversation: Conversation,
  images: { name: string; url: string }[]
) {
  const prompt =
    botReplyPrompt +
    convertConversationToPrompt(conversation, { useLast: true }) +
    "\n" +
    convertImagesToPrompt(images) +
    "\n[Bot] ";
  const response = await openai.createCompletion({
    prompt,
    model: "text-davinci-003",
  });
  return response.data.choices[0].text;
}

export async function rephrase(conversation: Conversation) {
  const prompt =
    rephrasePrompt +
    convertConversationToPrompt(conversation, { noImage: true }) +
    "\n[output]";
  console.log("Prompt: ", prompt);
  const response = await openai.createCompletion({
    prompt,
    model: "text-davinci-003",
  });
  return response.data.choices[0].text;
}
