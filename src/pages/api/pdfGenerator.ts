// import type { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "~/utils/supabaseClient";

// type DataOutputs = {
//   pdfUrl?: string;
//   error?: string;
// };

// let chromium: any;
// let puppeteer: any;

// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//   // running on the Vercel platform.
//   chromium = require("@sparticuz/chromium");;
//   puppeteer = require('puppeteer-core');
// } else {
//   // running locally.
//   puppeteer = require('puppeteer');
// }

// async function getBrowser() {
//   if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//     return await puppeteer.launch({
//       executablePath: await chromium.executablePath(),
//       headless: chromium.headless,
//       ignoreHTTPSErrors: true,
//       defaultViewport: chromium.defaultViewport,
//       args: [...chromium.args, "--hide-scrollbars", "--disable-web-security", "--no-sandbox", "--disable-setuid-sandbox"],
//     });
//   } else {
//     return await puppeteer.launch(
//       { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] },
//     );
//   }
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<DataOutputs>,
// ) {
//   if (req.method === "POST") {
//     const { scaffold_html: scaffold_html } = req.body;

//     if (!scaffold_html) {
//       res.status(400).json({ error: "Please provide activity html" });
//       return;
//     }

//     try {
//       let browser = await getBrowser();
//       const page = await browser.newPage();
//       await page.setContent(scaffold_html)

//       const pdfBuffer = await page.pdf({
//         format: "Letter",
//         printBackground: true,
//       });

//       await browser.close();

//       const fileName = `generated-${Date.now()}.pdf`;
//       // Upload PDF to Supabase Storage
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from("pdfs")
//         .upload(fileName, pdfBuffer, {
//           contentType: "application/pdf",
//         });

//       if (uploadError) {
//         console.error("Error uploading PDF to Supabase:", uploadError);
//         res.status(500).json({ error: "Failed to upload PDF to Supabase." });
//         return;
//       }

//       const { data: publicUrlData } = supabase.storage
//         .from("pdfs")
//         .getPublicUrl(fileName);

//       res.status(200).json({ pdfUrl: publicUrlData.publicUrl });
//     } catch (error) {
//       console.error("Error generating pdf:", error);
//       res.status(500).json({ error: "Failed to generate pdf: "+ error});
//     }
//   } else {
//     // Handle any non-POST requests
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
