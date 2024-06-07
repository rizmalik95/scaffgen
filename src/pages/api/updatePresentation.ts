import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import contentList from "@/utils/contentList";
import { slidesFormatter } from "@/utils/slidesFormatter";
import pdfToImages from "@/utils/pdfToImage";
import { ScaffoldProps } from "~/utils/interfaces";

function getJson(jsonString: string) {
  if (jsonString[0] !== "[") {
    jsonString = jsonString.substring(jsonString.indexOf("["));
  }
  if (jsonString[jsonString.length - 1] !== "]") {
    jsonString = jsonString.substring(0, jsonString.lastIndexOf("]") + 1);
  }
  return JSON.parse(jsonString);
}

async function getRequests(scaffold: ScaffoldProps) {
  if (scaffold.isAI) {
    return slidesFormatter(getJson(scaffold.HumanURL_AIContent));
  } else {
    const imageUrls = await pdfToImages(scaffold.HumanURL_AIContent);
    return imageUrls.map((imageUrl) =>
      slidesFormatter([
        {
          type: "image",
          url: imageUrl,
          width: 405,
          height: 720,
          translateX: 0,
          translateY: 0,
        },
      ]),
    );
  }
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
    const requestPromises = scaffolds.map((scaffold: ScaffoldProps) =>
      getRequests(scaffold),
    );

    const requests = (await Promise.all(requestPromises)).flat();

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
