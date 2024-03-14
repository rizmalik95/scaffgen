import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

type DataOutputs = {
  pdfUrl?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataOutputs>,
) {
  if (req.method === "POST") {
    const { scaffold_html: scaffold_html } = req.body;

    if (!scaffold_html) {
      res.status(400).json({ error: "Please provide activity html" });
      return;
    }

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(scaffold_html, {
        waitUntil: "networkidle0",
      });

      const pdfBuffer = await page.pdf({
        format: "Letter",
        printBackground: true,
      });

      await browser.close();

      const fileName = `generated-${Date.now()}.pdf`;
      const filePath = path.join(process.cwd(), "public", "pdfs", fileName);

      await writeFile(filePath, pdfBuffer);
      // Create a write stream
      res.status(200).json({ pdfUrl: path.join("pdfs", fileName) });
    } catch (error) {
      console.error("Error generating pdf:", error);
      res.status(500).json({ error: "Failed to generate pdf." });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
