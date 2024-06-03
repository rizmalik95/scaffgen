const { PDFDocument } = require('pdf-lib');
const fetch = require('node-fetch');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

// URL of the PDF
const pdfUrl = 'http://www.mathspad.co.uk/teach/linkedDocuments/negatives/Directed%20Numbers.pdf';

// Function to download the PDF
async function downloadPDF(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

// Function to convert PDF pages to images
async function convertPDFToImages(pdfBytes: Uint8Array) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const numPages = pdfDoc.getPageCount();

  for (let i = 0; i < numPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    const pageImage = await pdfDoc.embedPng(await page.drawPageToCanvas(context));
    context.drawImage(pageImage, 0, 0, width, height);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`page_${i + 1}.png`, buffer);
  }
}

// Main function
(async () => {
  const pdfBytes = await downloadPDF(pdfUrl);
  await convertPDFToImages(pdfBytes);
  console.log('Conversion complete!');
})();