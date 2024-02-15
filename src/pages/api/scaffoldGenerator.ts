// pages/api/generateActivity.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

// You would replace 'your_api_key_here' with your actual OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // It's best to keep your API key in environment variables
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
    const { lessonPlan, lessonObjective } = req.body;

    if (!lessonPlan || !lessonObjective) {
      res.status(400).json({ error: 'Please provide both lesson plan and lesson objective.' });
      return;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You are an expert middle-school math teacher, with particular expertise in supporting students with diverse learning needs access and thrive. You are tasked with creating additional materials that support all students to access the middle-school math curriculum. \n\nBefore responding, think carefully. "
          },
          {
            "role": "user",
            "content": "Your task is to create a resource that helps build students' understanding of mathematical language. For the learning objective below, you should: \n\n1. Determine the mathematical language associated with this topic. Examples of mathematical language are: \"hypotenuse\", \"quotient\", \"unit circle\". \n2. For each of these terms, write a simple definition for students and provide an example sentence of how it can be used. The definitions should be written such that a middle-school student can understand them easily. \n\nLearning Objective: \nCalculate equivalent ratios between prices and quantities and present the solution method (using words and other representations).\nCalculate unit price and express it using the word “per” (orally and in writing).\nUnderstand the phrase “at this rate” indicates that equivalent ratios are involved.\n\nFor the Learning Objective above, create a resource to build student understanding of mathematical language following the instructions above. Just provide the words, definitions and examples. "
          }
        ],
        temperature: 1,
        max_tokens: 256,
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
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
