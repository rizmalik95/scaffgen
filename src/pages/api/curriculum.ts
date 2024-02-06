import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';

async function extractMathCurriculumInfo(url: string): Promise<any> {
  try {
    const response = await axios.get(url);

    // Check if the request was successful
    if (response.status && response.status === 200) {
      const $ = cheerio.load(response.data);
      // Extract learning objectives
      const learningObjectives: string[] = [];
      $('li.im-c-list__item > div.im-c-content').each((index, element) => {
        learningObjectives.push($(element).text().trim());
      });

      // Extract standards being addressed
      const standards: string[] = [];
      $('p:contains("Addressing") + ul > li > a').each((index, element) => {
        standards.push($(element).text().trim());
      });

      return {
        learningObjectives: learningObjectives,
        standards: standards
      };
    } else {
      return `Failed to fetch the webpage, status code: ${response.status}`;
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
    return 'Failed to fetch the webpage';
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL must be provided and must be a string' });
    return;
  }

  try {
    const data = await extractMathCurriculumInfo(url);
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};