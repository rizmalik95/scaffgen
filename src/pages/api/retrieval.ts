import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// You would replace 'your_api_key_here' with your actual OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // It's best to keep your API key in environment variables
});

type DataOutputs = {
  title?: string;
  author?: string;
  link_url?: string;
  answer_url?: string;
  pdf_summary?: string;
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

      const mappedData = documents.map((document: any) => ({
        title: document.title,
        author: document.author,
        link_url: document.url,
        answer_url: document.answer_url,
        pdf_summary: document.summary
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