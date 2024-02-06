from openai import OpenAI
from API import OPENAI_API_KEY
client = OpenAI(api_key=OPENAI_API_KEY)

#http://www.nuffieldfoundation.org/sites/default/files/files/FSMA%20Large%20and%20small%20student.pdf

def get_summary(text):
    # This function assumes the text of the PDF is passed as an argument
    # You'll need to modify this to handle sending messages to the OpenAI API properly
    text = text[:6000] # truncate to 12000 characters to not hit token limit
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Give a concise 2 sentence summary of the following text."},
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content

def vocab_scaffold(text):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "prompt here"},
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content


# response = client.chat.completions.create(
#     model="gpt-3.5-turbo",
#     messages=[
#         {"role": "system", "content": "you are a helpful friend"},
#         {"role": "user", "content": "I really need help planning my schedule'"}
#     ]
# )

# print(response.choices[0].message.content)