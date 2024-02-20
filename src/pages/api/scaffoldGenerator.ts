import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Data = {
  activity?: string; // Soon to be pdfUrl
  title?: string;
  summary?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { lessonObjectives, lessonStandards, scaffoldType } = req.body;

    if (!lessonObjectives) {
      res.status(400).json({ error: 'Please provide both lesson objectives.' });
      return;
    }

    let promptContent = '';
    let promptOneContent = '';
    let promptTwoContent = '';

    if (scaffoldType === 'backgroundKnowledge') {
      promptOneContent = `You are an expert Grade 6 math teacher. For the learning objective, determine the five most important mathematical skills and knowledge they need to know before they start the lesson. These topics will be reviewed at the start of the lesson.

      Learning Objective: 
      
      ${lessonObjectives}
      
      For this learning objective, determine the five most important mathematical skills and knowledge they need to know before they start the lesson. These topics will be reviewed at the start of the lesson. 
      
      Provide your answer as: 
      
      Topic 1 - one-sentence rationale
      Topic 2 - one-sentence rationale
      Topic 3 - one-sentence rationale
      Topic 4 - one-sentence rationale
      Topic 5 - one-sentence rationale
      
      Think step by step.`;

      try {
        const prerequisiteResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert middle-school math teacher, with particular expertise in supporting students with diverse learning needs access and thrive. You are tasked with creating additional materials that support all students to access the middle-school math curriculum. Before responding, think carefully.'
            },
            {
              role: 'user',
              content: promptOneContent
            }
          ],
          temperature: 0.7,
          max_tokens: 512,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        const prerequisiteTopics = prerequisiteResponse.choices[0].message.content.trim();

        promptTwoContent = `Based on the prerequisite topics and today's learning objective, write a short warmup task for students that reviews and activates this necessary prior knowledge.

        Prerequisite Topics: 
        
        ${prerequisiteTopics}
        
        Today's Learning Objective: 
        
        ${lessonObjectives}
        
        Format your response as:
        
        Title: Skill Review! 
        
        Question 1: 
        Question 2: 
        Question 3:
        Question 4:
        Question 5:
        
        There is no need to reference the underlying topics.`;

        const warmupTaskResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: promptTwoContent // Adjusted to use promptTwoContent directly
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        const warmupTask = warmupTaskResponse.choices[0].message.content.trim();

        res.status(200).json(
          {
            activity: warmupTask,
            title: 'Background Knowledge',
            summary: 'This scaffold provides a warmup task that reviews and activates necessary prior knowledge for the lesson.'
          }
        );
      } catch (error) {
        console.error('OpenAI error:', error);
        res.status(500).json({ error: 'Failed to generate activity due to an internal error.' });
      }
    } else if (scaffoldType === 'mathLanguage') {
      // Correct placement and structure for mathLanguage scaffold handling
      promptContent = `You are an expert Grade 6 math teacher. Please create a short learning resource that helps develop students' mathematical language. This will be particularly helpful for students who are learning English. Information on today's lesson is below. 

      Today’s Lesson: 
      
      ${lessonObjectives}
      
      For this lesson, create a resource with the following sections, following the format outlined. Do not output anything else. 
      
      Title: Building Mathematical Language about... 
      
      Key Word 1
      Definition 
      Example 
      
      Key Word 2
      Definition 
      Example
      
      Key Word 3
      Definition 
      Example
      
      2. Sentence Stems: 
      
      [For the lesson, write a set of 5 helpful and simple sentence starters and frames for students to use in their conversations and responses to questions. These should help develop their mathematical language. These should reference the specific tasks they will do in the lesson.]
      
      1. 
      2.
      3.
      4.
      5.`;

      try {
        const mathLanguageResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              "role": "system",
              "content": "You are an expert middle-school math teacher, with particular expertise in supporting students with diverse learning needs access and thrive. You are tasked with creating additional materials that support all students to access the middle-school math curriculum. Before responding, think carefully."
            },
            {
              "role": "user",
              "content": promptContent
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        const mathLanguageTask = mathLanguageResponse.choices[0].message.content ?? "";
        res.status(200).json(
          {
            activity: mathLanguageTask,
            title: 'Background Knowledge',
            summary: 'This scaffold does math knowledge building'
          }
        );
      } catch (error) {
        console.error('OpenAI error:', error);
        res.status(500).json({ error: 'Failed to generate activity due to an internal error.' });
      }
    } else {
      res.status(400).json({ error: 'Invalid scaffoldType provided.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
