import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import contentList from "@/utils/contentList";
import { slidesFormatter } from "@/utils/slidesFormatter";

import { ScaffoldProps } from "~/utils/interfaces";

function getJson(jsonString: string) {
  if (jsonString[0] !== '[') {
    jsonString = jsonString.substring(jsonString.indexOf('['));
  }
  if (jsonString[jsonString.length-1] !== ']') {
    jsonString = jsonString.substring(0, jsonString.lastIndexOf(']')+1);
  }
  return JSON.parse(jsonString);
}

function isValidUrl(url: string) {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { accessToken, presentationId, scaffolds } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: "Access Token is required" });
    }

    // Set up Google Slides and Drive API
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    auth.setCredentials({
      access_token: accessToken,
    });

    const slides = google.slides({ version: "v1", auth });

    if (!presentationId) {
      throw new Error(
        "Failed to update presentation: No presentation ID returned",
      );
    }
    // const requests = scaffolds.flatMap(
    //   (scaffold: ScaffoldProps, index: number) =>
    //     slidesFormatter(getJson(scaffold.HumanURL_AIContent)),
    // );
    // const requests = slidesFormatter(contentList);
    const requests = [];

    for (const scaffold of scaffolds) {
      if (scaffold.isAI) {
        const aiRequests = slidesFormatter(getJson(scaffold.HumanURL_AIContent));
        requests.push(...aiRequests);
      } else {
        const images = scaffold.HumanURL_AIContent;
        for (const imgData of images) {
          if (!isValidUrl(imgData)) {
            console.error(`Invalid URL: ${imgData}`);
            return res.status(400).json({ error: `Invalid URL: ${imgData}` });
          }
          const slideId = `slide_${Math.random().toString(36).substring(7)}`;
          requests.push({
            createSlide: {
              objectId: slideId,
              slideLayoutReference: {
                predefinedLayout: 'BLANK',
              },
            },
          });
          requests.push({
            createImage: {
              url: imgData,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  width: { magnitude: 500, unit: "PT" },
                  height: { magnitude: 700, unit: "PT" },
                },
                transform: {
                  scaleX: 1,
                  scaleY: 1,
                  translateX: 50,
                  translateY: 50,
                  unit: "PT",
                },
              },
            },
          });
        }
      }
    }

    await slides.presentations.batchUpdate({
      presentationId: presentationId,
      requestBody: {
        requests: requests,
      },
    });

    res.status(200).json({
      message: "Presentation updated successfully!",
      presentationId: presentationId,
    });
  } catch (error) {
    console.error("Error creating presentation:", error);
    res.status(500).json({ error: "Failed to create presentation" });
  }
}
