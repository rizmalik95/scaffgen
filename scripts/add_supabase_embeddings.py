import os
from supabase import create_client, Client
from langchain_openai import OpenAIEmbeddings

from dotenv import load_dotenv

# Define the path to the .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
# Load the environment variables from the specified .env file
load_dotenv(dotenv_path=dotenv_path)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
print(url)
supabase: Client = create_client(url, key)

openai_embeddings = OpenAIEmbeddings()

data = supabase.table("scaffolds").select("summary, id").execute()
for row in data.data:
    summary_embedding = openai_embeddings.embed_query(row['summary'])
    data, count = supabase.table('scaffolds') \
        .update({'summary_embedding': summary_embedding}) \
        .eq('id', row['id']) \
        .execute()
    print(row['id'])