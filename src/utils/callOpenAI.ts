const MODEL = "gpt-3.5-turbo";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Message = {
  role: "system" | "user";
  content: string;
};

export default async function callOpenAI(
  system?: string,
  user?: string,
  maxTokens: number = 4096,
) {
  try {
    console.log('calling openai')
    let messages: Message[] = [];
    if (system) {
      messages.push({ role: "system", content: system });
    }
    if (user) {
      messages.push({ role: "user", content: user });
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log('done openai')
    return response.choices[0]?.message?.content?.trim() ?? "";
  } catch (error) {
    console.error("OpenAI error:", error);
    return null;
  }
}
