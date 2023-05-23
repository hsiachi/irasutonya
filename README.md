# Irasutonya

A website to search for [Irasutoya](https://www.irasutoya.com/) pictures with natural languages. Built with [Next.js](https://next-js.org), [TailwindCSS](https://www.tailwindcss.com) and [Qdrant](https://qdrant.tech).

## Features

- **Search pictures with natural language.** Model is finetuned on [CLIP](https://openai.com/research/clip) to get the vectors of pictures. The incoming query string is computed into a vector and Qdrant outputs the pictures with top similarities.
- **(Pseudo) Conversational search.** We leverage GPT to rephrase the user's query message to get the proper keyword. Here's an example:

  ```
  # Conversation
  [User] I want some pictures of cat.
  [Bot] ...
  [User] Maybe two in the picture?

  # Before rephrasing
  [Query] Maybe two in the picture?

  # After rephrasing
  [User] two cats in a picture
  ```
  This feature could be turned on in the `Settings - Rephrase` (default: false)
  
 - **Diverse reply.** We use GPT to generate a "nekoly" reply based on the searched pictures and the previous conversation. This feature could be turned on in the `Settings - Diversity` (default: false)
