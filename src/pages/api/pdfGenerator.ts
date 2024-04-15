import type { NextApiRequest, NextApiResponse } from "next";
import { chromium } from "playwright-chromium";
import { supabase } from "~/utils/supabaseClient";
import { set } from "zod";

type DataOutputs = {
  pdfUrl?: string;
  error?: string;
};

// async function setupPuppeteer() {
//   const browser = await puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath,
//     headless: chromium.headless,
//   });
//   return browser;
// }

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
      const browser = await chromium.launch();
      const page = await browser.newPage();

      await page.setContent(scaffold_html, {
        waitUntil: "networkidle",
      });

      const pdfBuffer = await page.pdf({
        format: "Letter",
        printBackground: true,
      });

      await browser.close();

      const fileName = `generated-${Date.now()}.pdf`;
      // Upload PDF to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(fileName, pdfBuffer, {
          contentType: "application/pdf",
        });

      if (uploadError) {
        console.error("Error uploading PDF to Supabase:", uploadError);
        res.status(500).json({ error: "Failed to upload PDF to Supabase." });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("pdfs")
        .getPublicUrl(fileName);

      res.status(200).json({ pdfUrl: publicUrlData.publicUrl });
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
