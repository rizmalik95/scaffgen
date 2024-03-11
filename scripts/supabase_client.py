import os
from supabase import create_client, Client

from dotenv import load_dotenv
import os
from tqdm.rich import tqdm

# Define the path to the .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
# Load the environment variables from the specified .env file
load_dotenv(dotenv_path=dotenv_path)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def add_to_supabase(table_name, scaffold_tuple):
    try:
        data, count = supabase.table(table_name).insert({
            "title": scaffold_tuple[0],
            "author": scaffold_tuple[1],
            "url": scaffold_tuple[2],
            "answer_url": scaffold_tuple[3],
            "summary": scaffold_tuple[4],
            "summary_embedding": scaffold_tuple[5],
            "type_tags": scaffold_tuple[6]
        }).execute()
    except Exception as e:
        print(f"An error occurred while trying to add data to Supabase: {e}")
