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
[User] I want a picture of a cat.
[Image] A cat with a red ribbon, A cat with a blue hat, A running cat.
[Bot] Here're some cute nekos I get for you!
[User] That's what I need. Thank you!
[Bot] You're welcome nya~
    
`;

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

function convertImagesToPrompt(images: { name: string; url: string }[]) {
  return "[Image] " + images.map((img) => img.name).join(", ");
}

function convertConversationToPrompt(conversation: Conversation) {
  return conversation.messages
    .map((msg) => {
      let m = `[${msg.role}] ${msg.text}`;
      if (msg.images) {
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
  console.log(conversation);
  const prompt =
    botReplyPrompt +
    convertConversationToPrompt(conversation) +
    "\n" +
    convertImagesToPrompt(images) +
    "\n[Bot] ";
  console.log(prompt);
  const openai = new OpenAIApi(config);
  const response = await openai.createCompletion({
    prompt: prompt,
    model: "text-davinci-003",
  });
  return response.data.choices[0].text;
}
