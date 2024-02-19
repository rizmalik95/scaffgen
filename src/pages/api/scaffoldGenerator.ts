import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Data = {
  activity?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { lessonObjectives, lessonStandards } = req.body;

    if (!lessonObjectives || !lessonStandards) {
      res.status(400).json({ error: 'Please provide both lesson objectives and lesson standards.' });
      return;
    }

    const promptContent = `You are an expert Grade 6 math teacher. Please create a short learning resource that helps develop students' mathematical language. This will be particularly helpful for students who are learning English. Information on today's lesson is below. \n\nToday’s Lesson: \n${lessonObjectives}\n\nFor this lesson, create a resource with the following sections, following the format outlined. Do not output anything else. \n\nTitle: Building Mathematical Language about... \n\nKey Word 1\nDefinition \nExample \n\nKey Word 2\nDefinition \nExample\n\nKey Word 3\nDefinition \nExample\n\n2. Sentence Stems: \n\n[For the lesson, write a set of 5 helpful and simple sentence starters and frames for students to use in their conversations and responses to questions. These should help develop their mathematical language. These should reference the specific tasks they will do in the lesson.]\n\n1. \n2.\n3.\n4.\n5.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You are an AI trained to assist with educational content creation."
          },
          {
            "role": "user",
            "content": promptContent
          }
        ],
        temperature: 0.7, // Adjusted for creativity but still keeping relevance
        max_tokens: 1024, // Increased to accommodate the detailed prompt
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      res.status(200).json({ activity: response.choices[0].message.content ?? "" });
    } catch (error) {
      console.error('OpenAI error:', error);
      res.status(500).json({ error: 'Failed to generate activity due to an internal error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
