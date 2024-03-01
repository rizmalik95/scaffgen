# Scrapes IM for Lesson Objective and Standard
import requests
from lxml import html
import sys  # Import sys to handle command-line arguments

def extract_math_curriculum_info(url):
    # Fetch the webpage
    response = requests.get(url)
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the content
        tree = html.fromstring(response.content)
        
        # Extract learning objectives
        learning_objectives = []
        # XPath to match the structure 
        objective_elements = tree.xpath('//li[contains(@class, "im-c-list__item")]/div[@class="im-c-content"]/text()')
        for objective in objective_elements:
            learning_objectives.append(objective.strip())
        
        # Extract standards being addressed
        standards_elements = tree.xpath('//p[text()="Addressing"]/following-sibling::ul[1]/li/a/text()')
        standards = [standard.strip() for standard in standards_elements]
        
        return {
            'learning_objectives': learning_objectives,
            'standards': standards  
        }
    else:
        return f'Failed to fetch the webpage, status code: {response.status_code}'

def main():
    # Check if a URL was provided as a command-line argument
    if len(sys.argv) > 1:
        url = sys.argv[1]
        data = extract_math_curriculum_info(url)
        print(data)
    else:
        print("Please provide a URL as an argument.")

if __name__ == "__main__":
    main()
