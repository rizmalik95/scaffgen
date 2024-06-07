import { pdf } from "pdf-to-img";
import { google } from "googleapis";
import { supabase } from "./supabaseClient";
import fetch from "node-fetch";

async function downloadPDFAsDataURL(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.statusText}`);
  }
  const buffer = await response.buffer();
  const base64 = buffer.toString('base64');
  return `data:application/pdf;base64,${base64}`;
}


export default async function pdfToImages(url: string): Promise<string[]> {
  const dataUrl = await downloadPDFAsDataURL(url);

  const document = await pdf(dataUrl);

  const imageUrls: string[] = [];
  for await (const image of document) {
    // write to supabase
    const fileName = `generated-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, image, {
        contentType: "image/png",
      });

    if (uploadError) {
      console.error("Error uploading image to Supabase:", uploadError);
      return [];
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    imageUrls.push(publicUrlData.publicUrl);
  }

  return imageUrls;
}
