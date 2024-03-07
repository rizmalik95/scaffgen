from openai import OpenAI
from dotenv import load_dotenv
import os
# from langchain_openai import OpenAIEmbeddings
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
    prompt = "You are a skilled middle school math Educator in the United States who will receive a classroom scaffold and analyze (1) what is the format of the scaffold, (2) the main math concepts being taught that are relevant to middle school level learning, (3) which types of students would benefit from this activity. Be helpful, informative, and include the description of this scaffold as 2-3 sentences in a paragraph."
    prompt2 = """
    This is a lesson task for middle school math. You are an expert instructional designer. For this task, you will write a set of tags. The tags should include:

    High-level topic
    Specific sub-level topic 
    CCSS standards that align to the task (maximum 3)
    Learning Objectives that the task supports 
    Specific learners that the task supports

    Think step by step. Provide the tags and nothing else. 
    """
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": prompt2},
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content

def get_tags(text):
    # This function assumes the text of the PDF is passed as an argument
    # It returns scaffold type tags (frontend) and scaffold retrieval tags (backend)
    type_prompt = """
    For the provided lesson task, your job is to assign 1-2 tags that capture the instructional purpose of the task. Below are the possible tags: 

    Building Math Language: Tasks designed to increase student comprehension and understanding of key mathematical words, and to build their confidence and skills using math language. Example tasks for this tag are sets of vocabulary and sentence stems. 

    Developing Fluency: Tasks designed to improve student procedural fluency, which is the ability to apply procedures efficiently, flexibly, and accurately. 

    Activate Background Knowledge: Tasks designed to activate and refresh relevant background and prerequisite skills and knowledge. These tasks might involve anchoring instruction in relevant prior knowledge, pre-teaching critical concepts, and short warmups that review key skills.

    Addressing Misconceptions: Tasks designed to support students to recognise and learn from common misconceptions. 

    Recruiting Interest: Tasks that link the topic to student interests. This might involve tasks that relate to the real-world or to topics that might be of special interest to middle-school students.

    Extra Challenge: Tasks designed to deepen and enrich student understanding. These are tasks that are likely more suited to students who are working at grade level or even above grade level. 

    Think step by step. In your response, just provide the appropriate tags, split by comma, and nothing else. 

    Building Math Language
    Developing Fluency
    Activate Background Knowledge
    Addressing Misconceptions
    Recruiting Interest
    Extra Challenge
    """
    response1 = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": type_prompt},
            {"role": "user", "content": text}
        ]
    )
    type_tags = response1.choices[0].message.content

    # retrieval_prompt = """
    # """
    # response2 = client.chat.completions.create(
    #     model="gpt-4",
    #     messages=[
    #         {"role": "system", "content": retrieval_prompt},
    #         {"role": "user", "content": text}
    #     ]
    # )
    # retrieval_tags = response2.choices[0].message.content

    return type_tags

def create_embedding(summary):
    openai_embeddings = OpenAIEmbeddings()
    summary_embedding = openai_embeddings.embed_query(summary)
    return summary_embedding