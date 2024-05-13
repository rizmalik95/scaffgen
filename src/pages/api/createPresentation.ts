import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Access Token is required' });
    }

    // Set up Google Slides and Drive API
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      access_token: accessToken,
    });

    const slides = google.slides({ version: 'v1', auth });
    
    // Create a new presentation
    const presentation = await slides.presentations.create({
      requestBody: {
        title: "New Presentation",
      },
    });

    if (!presentation.data.presentationId) {
      throw new Error('Failed to create presentation: No presentation ID returned');
    }

    res.status(200).json({
      message: 'Presentation created successfully!',
      presentationId: presentation.data.presentationId,
    });

  } catch (error) {
    console.error('Error creating presentation:', error);
    res.status(500).json({ error: 'Failed to create presentation' });
  }

}