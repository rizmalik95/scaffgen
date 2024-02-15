import os
from supabase import create_client, Client
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.docstore.document import Document

# Set OpenAI API key
os.environ['OPENAI_API_KEY'] = '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'
# os.environ['OPENAI_API_KEY'] = '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'

# Initialize Supabase client
url = "https://cukkxrhvvllrdsfexoqj.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1a2t4cmh2dmxscmRzZmV4b3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxNzA1NTQsImV4cCI6MjAyMjc0NjU1NH0.QxtX9x2N0Uk80W_Rh9xbwh8Rua8prA0cl6rhuB5SPFk"
supabase: Client = create_client(url, key)

# Initialize OpenAI Embeddings
openai_embeddings = OpenAIEmbeddings()

# Initialize Chroma vector store
db = Chroma(embedding_function=openai_embeddings)

# Call this function once to update db vector store
def store_embeddings_in_chroma():
    data = supabase.table("scaffolds").select("summary, id").execute()
    for row in data.data:
        curr_doc = Document(
            page_content = row['summary'],
            metadata = {
                "id": row['id']
            }
        )
        db.add_documents([curr_doc])
store_embeddings_in_chroma()
print(db)

# Return top k similar human-written Scaffolds
def get_top_similar_scaffolds(lesson_summary):
    docs = db.similarity_search(lesson_summary)
    
    # Extract Supabase URLs from docs
    urls = [docs.metadata['url'] for doc in docs]  
    
    # Return the Supabase URLs or IDs
    return urls

test_lesson_summary = """Calculate the distance an object travels in 1 unit of time and express it using a phrase like 'meters per second' (orally and in writing).
For an object moving at a constant speed, use a double number line diagram to represent equivalent ratios between the distance traveled and elapsed time.
Justify (orally and in writing) which of two objects is moving faster, by identifying that it travels more distance in the same amount of time or that it travels the same distance in less time."""

top_results = get_top_similar_scaffolds(test_lesson_summary)
print(top_results)