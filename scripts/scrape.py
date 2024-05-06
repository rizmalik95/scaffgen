import requests
from lxml import html
import sys  # Import sys to handle command-line arguments

from supabase import create_client, Client


#Repeated words that are useless
stopwords = ["IM Certified Partners", ".", "", 'For access, consult one of our', ',']

def parse_prep(url):
    response = requests.get(url)
    if response.status_code == 200:
        # Parse the content
        tree = html.fromstring(response.content) 
         
        narrative_elements = tree.xpath('//*[@id="root"]/main/div[3]/div[1]/div[2]/div//p/text()')
        narratives = [narrative.strip() for narrative in narrative_elements] 

        objective_elements = tree.xpath('//li[contains(@class, "im-c-list__item")]/div[@class="im-c-content"]/text()')
        learning_objectives = [ objective.strip() for objective in objective_elements ]
        
        standards_elements = tree.xpath('//p[text()="Addressing"]/following-sibling::ul[1]/li/a/text()')
        standards = [standard.strip() for standard in standards_elements]

        return {
            'lesson_narratives' : narratives,
            'learning_objectives' : learning_objectives,
            'standards' : standards
        }

    else:
        return f'Failed to fetch the preparation webpage, status code: {response.status_code}'

def parse_lesson(url):
    response = requests.get(url)
    if response.status_code == 200:
        tree = html.fromstring(response.content)    

        warmup_elements = tree.xpath('//*[@id="root"]/main/div[4]/div[1]/div[2]/div//p/text()')
        warmup_list_elements = tree.xpath('//*[@id="root"]/main/div[4]/div[1]/div[2]/div//ul//li/text()')
        warmups = [warmup.strip() for warmup in warmup_elements] + [warmup_list.strip() for warmup_list in warmup_list_elements]
        warmups = [warmup for warmup in warmups if warmup not in stopwords]

        launch_elements = tree.xpath('//*[@id="root"]/main/div[4]/div[2]/div[2]/div//p/text()')
        launchs = [launch.strip() for launch in launch_elements]
        launchs = [launch for launch in launchs if launch not in stopwords]

        synthesis_elements = tree.xpath('//*[@id="root"]/main/div[4]/div[5]/div[2]/div//p/text()')
        synth_list_elems = tree.xpath('//*[@id="root"]/main/div[4]/div[5]/div[2]/div//ul//li/text()')
        synthesis = [synthesis_elem.strip() for synthesis_elem in synthesis_elements] + [synth_list_elem.strip() for synth_list_elem in synth_list_elems]
        synthesis = [elem for elem in synthesis if elem not in stopwords]


        return {
            'warmup' : warmups,
            'launch' : launchs,
            'activity_synthesis' : synthesis
        }
    

    


    else:
        return f'Failed to fetch the lesson webpage, status code: {response.status_code}'
    
def parse_practice(url):
    response = requests.get(url)
    if response.status_code == 200:
        tree = html.fromstring(response.content) 
        
        content_elements = tree.xpath('//*[@id="root"]/main/div[3]//text()')
        contents = [content.strip() for content in content_elements if content.strip() not in stopwords]
        contents = [content for content in contents if content != "Solution"]
        return {
            'contents' : contents
        }
    else:
        return f'Failed to fetch the practice webpage, status code: {response.status_code}'


def extract_math_curriculum_info(url):
    index = url.rfind('/')
    prep = parse_prep(url[:index + 1] + "preparation.html")
    lesson = parse_lesson(url[:index + 1] + "index.html")
    practice = parse_practice(url[:index + 1] + "practice.html")

    #Get title
    response = requests.get(url)
    if response.status_code == 200:
        tree = html.fromstring(response.content) 

        lesson_number = [elem.strip() for elem in tree.xpath('//*[@id="root"]/main/div[1]/h1/text()')]
        lesson_name = [elem.strip() for elem in tree.xpath('//*[@id="root"]/main/div[1]/p/text()')]   

        lesson_number = tree.xpath('//*[@id="root"]/main/div[1]/h1/text()')
        lesson_name = tree.xpath('//*[@id="root"]/main/div[1]/p/text()')   
        title = lesson_number + lesson_name
    else:
        return f'Failed to fetch the webpage, status code: {response.status_code}'
        
    return {
            'Title' : title,
            'preparation' : prep,
            'lesson' : lesson,
            'practice' : practice
        }
  
def export_data(data, table_name):
    url = "https://vvlqdcdjqfsxelpoaiaf.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bHFkY2RqcWZzeGVscG9haWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NTI2MTEsImV4cCI6MjAzMDUyODYxMX0.TQu-K86z2C8W923P2ewDxWG2heXbPGVDW5DrezrO5hY"
    supabase: Client = create_client(url, key)

    try:
         supabase.table(table_name).insert({
            "title": data['Title'],
            'preparation' : data['preparation'],
            'lesson' : data['lesson'],
            'practice' : data['practice']
            
        }).execute()
    except Exception as e:
        print(f"An error occurred while trying to add data to Supabase: {e}")



    
    
    
#Either give a lesson URL in CLI or will run on all 
def main():
    res = []
    urls = []
    if len(sys.argv) > 1:
        for i in range(1, len(sys.argv)):
            urls.append(sys.argv[i])
    else:
        urls = [
            "https://curriculum.illustrativemathematics.org/MS/teachers/1/1/12/preparation.html",      
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/2/12/preparation.html',
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/2/4/preparation.html',
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/3/15/preparation.html',
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/4/13/preparation.html',
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/3/6/preparation.html',
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/4/7/preparation.html',
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/5/12/preparation.html',
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/6/4/preparation.html',
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/6/15/preparation.html',
            'https://curriculum.illustrativemathematics.org/MS/teachers/1/7/7/preparation.html'
        ]

    for url in urls:
        data = extract_math_curriculum_info(url)
        res.append(data)

    for data in res:
        for elem in data:
            print(elem.capitalize())
            print(data[elem])
            print("\n")
    
    export_data(data, "test")

    
    

if __name__ == "__main__":
    main()