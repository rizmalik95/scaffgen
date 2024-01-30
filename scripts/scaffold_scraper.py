import requests
from bs4 import BeautifulSoup, NavigableString
import re

# The URL of the website to fetch HTML content from
url = 'https://www.resourceaholic.com/p/this-page-lists-recommended-resources.html#Ratio'

# Send an HTTP GET request to the URL
response = requests.get(url)

# Function to check if a link is a PDF
def is_pdf(link):
    return link['href'].endswith('.pdf')

scaffold_list = []

html_content = response.text
soup = BeautifulSoup(html_content, 'html.parser')

# scaffold_list = title, author, link, answer link (optional)

curr_ul = soup.find('ul')
while True:
    for li in curr_ul.find_all('li'):
        links = li.find_all('a')
        if len(links) == 0: continue

        link_text, link_url, answer_url = '', '', ''

        if is_pdf(links[0]):
            link_text = links[0].get_text(strip=True)
            link_url = links[0]['href']
        
        for link in links:
            if link.get_text(strip=True).lower() == 'answers':
                answer_url = link['href']
            
            author = link.next_sibling
            if author and isinstance(author, NavigableString):
                author = author.strip()
                author = re.sub(r'[^a-zA-Z0-9 ]', '', author).lstrip()
            else:
                author = ''
        
        if link_url != '':
            scaffold_list.append((link_text, author, link_url, answer_url))
        
        

    curr_ul = curr_ul.find_next('ul')

    if curr_ul is None:
        break

for s in scaffold_list:
    print(s)