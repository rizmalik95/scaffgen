const MODEL = "gpt-4o";

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
    return response.choices[0]?.message?.content?.trim() ?? "";
  } catch (error) {
    console.error("OpenAI error:", error);
    return null;
  }
}
