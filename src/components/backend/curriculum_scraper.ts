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

// Example usage
// extractMathCurriculumInfo('https://example.com').then(data => console.log(data));