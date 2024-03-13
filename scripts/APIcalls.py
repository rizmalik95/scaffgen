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
    prompt = "You are a skilled middle school math Educator in the United States who will receive a classroom scaffold and analyze (1) what is the format of the scaffold, (2) the main math concepts being taught that are relevant to middle school level learning, (3) which types of students would benefit from this activity. Be helpful, informative, and include the description of this scaffold as 2-3 sentences in a paragraph."
    prompt2 = """
    You are an expert instructional designer. You are also a middle-school math teacher using this task in a lesson. For the task, consider how you would use it in the lesson, and then write a set of tags. The tags should include:

    High-level topic
    Specific sub-level topic 
    CCSS standards that align to the task (maximum 3)
    Learning Objectives that the task supports 
    A one-sentence summary of the task that includes: (1) what the task is, (2) the specific sub-level topics. 

    Example response: 
    {
    "High-level topic": "The number system - Fractions",
    "Specific sub-level topic": "Dividing fractions",
    "CCSS standards": [
        "6.NS.A.1: Interpret and compute quotients of fractions, and solve word problems involving division of fractions by fractions, e.g., using visual fraction models and equations to represent the problem.",
        "7.NS.A.2: Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers."
    ],
    "Learning Objectives": [
        "Coordinate different strategies for dividing by a fraction, utilizing oral, written, and other representational methods.",
        "Find the quotient of two fractions and explain the solution method comprehensively through oral, written, and other forms of representation."
    ],
    "Summary": "Students will ​​students will critically analyze a range of statements about operations involving division of fractions, deciding whether they are Always, Sometimes, or Never True."
    }

    For the task, consider how you would use it in the lesson, and then write a set of tags. Think step by step. Provide the JSON response and nothing else. 
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