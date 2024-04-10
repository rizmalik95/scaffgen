import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

// You would replace 'your_api_key_here' with your actual OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // It's best to keep your API key in environment variables
});

type DataOutputs = {
  title?: string;
  author?: string;
  link_url?: string;
  answer_url?: string;
  pdf_summary?: string;
  standard?: string;
  type_tags?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataOutputs>
) {
  if (req.method === 'POST') {
    const { objectives, standards, k } = req.body;

    if (!objectives || !k || !standards) {
      res.status(400).json({ error: 'Please provide both objectives and k' });
      return;
    }
    
    try {
      const queryEmbedding = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: objectives + standards, // this is the line to change
      });

      const queryEmbeddingData = queryEmbedding.data ?? [];
      const queryEmbeddingValue = queryEmbeddingData[0]?.embedding ?? null;

      // In production we should handle possible errors
      const { data: documents, error: matchDocumentsError } = await supabaseClient.rpc('match_documents', {
        query_embedding: queryEmbeddingValue,
        match_threshold: 0.5, // Choose an appropriate threshold for your data
        k: k, // Choose the number of matches
      });

      if (matchDocumentsError) {
        throw matchDocumentsError;
      }

      const parseSummaryToJson = (document: { summary: string; }) => {
        try {
          // Parse the JSON string to an object
          const summaryObject = JSON.parse(document.summary);
          return summaryObject;
        } catch (error) {
          console.error('Error parsing summary:', error);
          // Handle the error as needed
        }
      };

      const changedPdfSummary = (document: any) => {
        const summaryObject = parseSummaryToJson(document);
        return summaryObject ? summaryObject.Summary : undefined;
      };

      // const changedStandard = (document) => {
      //   const summaryObject = parseSummaryToJson(document);
      //   // Corrected the key to match your JSON object structure.        
      //   return summaryObject ? summaryObject['CCSS standards'] : undefined;
      // };

      const changedStandard = (document: any) => {
        const summaryObject = parseSummaryToJson(document);
        if (!summaryObject) return undefined;
    
        // Ensure 'CCSS standards' exists and is an array.
        const standardsArray = summaryObject['CCSS standards'];
        if (!Array.isArray(standardsArray)) {
            console.error('CCSS standards is not an array:', standardsArray);
            return ""; // Return an empty string or handle this case as appropriate.
        }
    
        // Regex to match any character sequence up to the first colon in each string.
        const regex = /([^:]+)(?=:)/g;
    
        // Map through the array, applying the regex to each standard description to extract just the standard codes.
        const matchedStandards = standardsArray.map((standardDesc) => {
            const match = standardDesc.match(regex);
            return match ? match[0] : null; // Extract the first match, which should be the standard code.
        }).filter(Boolean); // Remove any null entries if a match wasn't found.
    
        // Join the array of matched standards into a single string separated by commas.
        const standardsString = matchedStandards.join(", ");
    
        return standardsString; // Return the single string of standards.
      };
            
      const mappedData = documents.map((document: any) => ({
        title: document.title,
        author: document.author,
        link_url: document.url,
        answer_url: document.answer_url,
        pdf_summary: changedPdfSummary(document),
        standard: changedStandard(document),
        type_tags: document.type_tags,
}));

      res.status(200).json(mappedData);
    } catch (error) {
      console.error('Error getting scaffolds:', error);
      res.status(500).json({ error: 'Failed to fetch scaffolds.' });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}