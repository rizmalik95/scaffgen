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