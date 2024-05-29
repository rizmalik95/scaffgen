import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import contentList from '@/utils/contentList';
import { slidesFormatter } from '@/utils/slidesFormatter';

import { ScaffoldProps } from '~/utils/interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { accessToken , presentationId, scaffolds } = req.body;

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

        if (!presentationId) {
            throw new Error('Failed to update presentation: No presentation ID returned');
        }
        
        // const presentationContent = await callOpenAI(systemPrompt, userPrompt);
        // const { requests, slideId } = slidesFormatter(contentList); -- This used to update the presentation from slidesFormatter
        const requests = scaffolds.map((scaffold: ScaffoldProps, index: number) => ({
            createSlide: {
                slideLayoutReference: {
                    predefinedLayout: 'TITLE_AND_BODY',
                },
                insertionIndex: index,
                placeholderIdMappings: [
                    {
                        layoutPlaceholder: {
                            type: 'TITLE',
                        },
                        objectId: `title_${index}`,
                    },
                    {
                        layoutPlaceholder: {
                            type: 'BODY',
                        },
                        objectId: `body_${index}`,
                    },
                ],
            },
        }));
        
        await slides.presentations.batchUpdate({
            presentationId: presentationId,
            requestBody: {
                requests: requests
            }
        });

        const textRequests = scaffolds.flatMap((scaffold: ScaffoldProps, index: number) => [
            {
                insertText: {
                    objectId: `title_${index}`,
                    text: scaffold.title,
                },
            },
            {
                insertText: {
                    objectId: `body_${index}`,
                    text: scaffold.HumanURL_AIContent,
                },
            },
        ]);

        await slides.presentations.batchUpdate({
            presentationId: presentationId,
            requestBody: {
                requests: textRequests
            }
        });

        res.status(200).json({
            message: 'Presentation updated successfully!',
            presentationId: presentationId,
        });

    } catch (error) {
        console.error('Error creating presentation:', error);
        res.status(500).json({ error: 'Failed to create presentation' });
    }

}