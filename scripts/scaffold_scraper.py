import requests
import fitz  # PyMuPDF
from bs4 import BeautifulSoup, NavigableString
import re
import os
from APIcalls import get_summary

pdf_directory = "PDF"
if not os.path.exists(pdf_directory):
    os.makedirs(pdf_directory)

# The URL of the website to fetch HTML content from
url = 'https://www.resourceaholic.com/p/this-page-lists-recommended-resources.html#Ratio'

# Send an HTTP GET request to the URL
response = requests.get(url)

# Function to check if a link is a PDF
def is_pdf(link):
    return link['href'].endswith('.pdf')

# Download, Read, and summarize a PDF
def download_read_summarize_pdf(link):
    response = requests.get(link)
    filename = os.path.join(pdf_directory, link.split('/')[-1]) # Save PDFs in the specified directory
    with open(filename, 'wb') as f:
        f.write(response.content)

    try:
        with fitz.open(filename) as doc:
            text = ""
            for page in doc:
                text += page.get_text()
        summary = get_summary(text)
        return summary
    except fitz.FileDataError as e:
        print(f"Cannot open broken document: {e}")
        return ""  # Return an error message or use another appropriate response

scaffold_list = []

html_content = response.text
soup = BeautifulSoup(html_content, 'html.parser')

# scaffold_list = title, author, link, answer link (optional), 2 sentence summary

curr_ul = soup.find('ul')
while True:
    for li in curr_ul.find_all('li'):
        links = li.find_all('a')
        if len(links) == 0: continue

        link_text, link_url, answer_url, pdf_summary = '', '', '', ''

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
            pdf_summary = download_read_summarize_pdf(link_url)
            print((link_text, author, link_url, answer_url, pdf_summary))
            scaffold_list.append((link_text, author, link_url, answer_url, pdf_summary))
        
    curr_ul = curr_ul.find_next('ul')

    if curr_ul is None:
        break

for s in scaffold_list:
    print(s)