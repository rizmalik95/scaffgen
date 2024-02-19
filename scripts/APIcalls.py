from openai import OpenAI
from dotenv import load_dotenv
import os
from langchain_openai import OpenAIEmbeddings
import requests
from io import BytesIO
import time
import sys

# Get environment ifnormation from .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)
OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

#http://www.nuffieldfoundation.org/sites/default/files/files/FSMA%20Large%20and%20small%20student.pdf

def get_summary(text):
    # This function assumes the text of the PDF is passed as an argument
    # You'll need to modify this to handle sending messages to the OpenAI API properly
    text = text[:6000] # truncate to 12000 characters to not hit token limit
    prompt = "You are a skilled middle school math Educator in the United States who will receive a classroom scaffold and analyze (1) what is the format of the scaffold, (2) the main math concepts being taught that are relevant to middle school level learning, (3) which types of students would benefit from this activity. Be helpful, informative, and include the description of this scaffold as 2-3 sentences in a paragraph."
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content

def create_embedding(summary):
    openai_embeddings = OpenAIEmbeddings()
    summary_embedding = openai_embeddings.embed_query(summary)
    return summary_embedding



# class ScaffoldSummaryAssistant: # Generating Scaffolds
#     def __init__(self):
#         self.assistant = client.beta.assistants.create(
#             instructions="You are a skilled middle school math Educator in the United States who will receive a classroom scaffold and analyze (1) what is the format of the scaffold, (2) the main math concepts being taught that are relevant to middle school level learning, (3) which types of students would benefit from this activity. Be helpful, informative, and include the description of this scaffold in 2-3 sentences as one paragraph.",
#             model="gpt-4"
#         )
#         self.thread = client.beta.threads.create()

#     def get_pdf_object(self, url):
#         response = requests.get(url)
#         if response.status_code == 200:
#             pdf_object = BytesIO(response.content)
#             return pdf_object
#         else:
#             print(f"Failed to retrieve the PDF file. Status code: {response.status_code}")
#             return None

#     def gen_scaffold_summary(self, assistant, scaffold_url):
#         pdf_object = self.get_pdf_object(scaffold_url)

#         # upload the pdf to the assistant
#         file_response = client.files.create(file=pdf_object, purpose="assistants")
#         file_id = file_response.id

#         print(file_response)

#         message = client.beta.threads.messages.create(
#             thread_id=self.thread.id,
#             role="user",
#             content="Please read the PDF",
#             # file_ids=[file_id]
#         )

#         run = client.beta.threads.runs.create(
#             thread_id=self.thread.id,
#             assistant_id=self.assistant.id
#         )
#         counter = 0
#         while run.status != "completed":
#             run = client.beta.threads.runs.retrieve(
#                 thread_id=self.thread.id,
#                 run_id=run.id
#             )
#             time.sleep(1)
#             counter += 1
#             sys.stdout.write("\rTime elapsed: {} seconds".format(counter))
#             sys.stdout.flush()

#         messages = client.beta.threads.messages.list(
#             thread_id=self.thread.id
#         )

#         print(messages.data[0].content[0].text.value)

#         #delete file
#         client.files.delete(file_id=file_id)

        

# if __name__ == "__main__":
#     assistant = ScaffoldSummaryAssistant()
#     assistant.gen_scaffold_summary(assistant, "http://taylorda01.weebly.com/uploads/4/2/3/8/42387051/write_ratios_in_the_form_n_to_1.pdf")


# Example Format
# response = client.chat.completions.create(
#     model="gpt-3.5-turbo",
#     messages=[
#         {"role": "system", "content": "you are a helpful friend"},
#         {"role": "user", "content": "I really need help planning my schedule'"}
#     ]
# )
# print(response.choices[0].message.content)