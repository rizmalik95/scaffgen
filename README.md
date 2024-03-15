# Scaffgen

![image](https://github.com/rmalde/scaffgen/assets/47470168/2fcff70b-89df-4465-a68f-dcccd1678b9f)

We plan to build a simple tool that takes in a teacher’s curricular materials and provides a set of curated scaffolded activities that supplement and support these materials. Some of these outputs will be LLM-created and some others will be human-written. 

### User Story
Teacher X is preparing a lesson on the quadratic equation from the curricular resources they have been provided by their district. However, these materials do not include sufficient opportunities for practice, nor are they tailored to the specific needs of their students. Teacher X can upload or link to their curriculum, and our tool provides a set of classroom-ready, customizable instructional scaffolds, including: (1) additional practice questions (written by expert teachers), (2) suggested real-world connections (generated by LLM), and (3) other interactive classroom activities

## User Testing Instructions
Create a .env file with 
```
POSTGRESS_PASSWORD=''
SUPABASE_URL=''
SUPABASE_KEY=''
OPENAI_API_KEY=''
```
In terminal, to install all npm dependencies, run
```
npm install
```
and then start the webapp with
```
npm run dev
```

Once the page is up, go to "Generate can enter any lesson url from Illustrative Mathematics (for example: https://curriculum.illustrativemathematics.org/MS/teachers/1/2/4/preparation.html) which should generate a results card (scraped from the IM page showcasing learning objectives and the exact standard) and scaffolds that are retrieved from our human-generated database, and LLM generated scaffolds. 

## Sprint 4 Goals / Demo Day Plans
(1) Improve Output Quality: We want to go back to what we previously implemented and improve the matching algorithm to increase the quality of retrieved human-written scaffolds. We plan to improve this process by having an LLM call which assigns different tags to each human scaffold that we can use to improve retrieval quality. Additionally, we want to continue generating high quality LLM-written scaffolds by implementing automated scoring and evaluation features of our LLM generated content.

(2) Improve UI: Especially for Demo Day, we want our front end to look more polished and appealing to use. This includes changes to the images on our scaffolds, removing our result card from displaying on the front end, formatting our LLM generated scaffolds into PDFs that are classroom ready, and more.

(3) User Testing: We are working on setting up in-person meetings and zoom calls with various middle school math teachers to provide user feedback on our product (evaluating our content quality and usability). 

## Sprint Updates

### Sprint 1
#### Ronak
In this sprint, I worked with everyone else to primarily scope our project, come up with the most essential features and system design. I helped brainstorm the different technology stacks nad how we will connect different pieces of software together and store our data. We talked with the Khanmigo team, and then as a group discussed how we can differentiate ourselves from what Khan Academy already offers. On the technical side, I first worked with Ritika to scrape Resourceaholic website for pdf scaffolds. Then, I started working on connecting our Python scripts to the frontend T3 app that we have built. This part is unfinished, so I will continue it in the next sprint. 

For the next sprint, my goal is first finish connecting the two scraping scripts we have (the resourceaholic scraper for scaffolds, and the illustrative mathematics scraper for lessons) to the frontent in Typescript, so that they can be surfaced by frontend components. Then, I want to work on two things. One, populating databases with our scraped information, instead of current method of computing on the fly, so we only have to make these scrapes once. Two, I will work with Ritika to build logic for the LLM to match relevant scaffolds with the current lesson plan. 

#### Ritika
This past sprint, we spent a lot of time defining our solution and making sure we were addressing the main problem that Riz had identified in his previous user research. Most of the first week was brainstorming ideas, and clearly identifying what we needed to code. Towards the end of the first week, Ronak and I wrote one of our scraping scripts to create our human-written scaffolds for middle school math formatted as a list of tuples in the following format: (Scaffold Name, Author, Link URL if it is a PDF, Answer URL if it exists, 2 Sentence Summary). The next week, I worked on making an API call to read each pdf and provide the 2 sentence summary that we included in our human-written scaffold database.

For sprint 2, I plan to help write our prompts to create LLM generated scaffolds. In speaking with individuals from Khanmigo, they shared that all of their Educational tools are based on prompt engineering and no fine tuning. I think that could be interesting for us to test out at some point, but starting with prompt generation, and helping create another LLM model that’s able to match teacher queries with the GPT summaries we produced.

#### Riz
We spent some time narrowing in on the specific problem that we’re hoping to solve. This involved me sharing some of the insights that I’ve gained from qualitative research with teachers over the past few months. This helped us narrow in on two main points of differentiation: (1) connection to teachers’ existing curriculum, and (2) returning teacher-created scaffolds to the teacher, as well as LLM-created ones. This was really helpful to get us all on the same page. I then spent the bulk of my time this week on two main tasks: (1) writing a python script that extracts key information from Illustrative Mathematics, and (2) putting together a simple frontend for the app. 

In the next sprint, I will be working on the prompting needed to create the LLM scaffolds based on the curriculum. I will also begin working on the logic that powers the app to retreive the appropriate human-crafted scaffold for specific curriculum inputs. This is going to involve a lot of trial and error and iterative improvements. I'll also be assisting with the frontend design. 

### Sprint 2

#### Ronak
In sprint 2, I mainly worked on building backend Node api's that got information from our database and AI generated scaffolds, so that they can be called by the frontend to populate our scaffold result cards. At the end, I also helped Riz and Ritika set up a vector database so that we can do RAG on relevant generated scaffolds (this one is WIP)

For the next sprint, I plan on finishing up the vector database and build out the backend api that will fetch the top k cosine similarity results from the vector database. Then, I will focus on one of our GPT prompt construction tasks that we've outlined for sprint 3 (either generating better scaffolds or LLM evaluation/scoring of scaffolds). 

#### Ritika
This sprint, I helped improve some of our front end design. I started by drawing a basic sketch of what we wanted the teacher experience to look like, explored how react + frontend code in general works, then implemented two main parts of that. First I improved the UI for our url upload page (InputForm.tsx) then created the (AllScaffolds.tsx) page that uses a slider function to display different scaffolds once populated with an array of information we would pass from our backend. We're still playing around with the specifics of what this UI looks like to be most relevant to teachers, but this is our current set up! Towards the end of the script, I also worked with Riz to write our retrieval code which Ronak/Riz later worked on connecting to supabase (our datasets!). 

For the next sprint, I will probably help with our first two goals of generating more LLM scaffolds and helping create the bar graph / pros and cons section.

#### Riz 
Over the course of this sprint, I worked across a range of mini-projects. The first of these involved working with Ritika to write a script that retreives relevant human scaffolds from our Supabase database. This involved going through the Langchain documentation and learning how to implement the embeddings and retrieval search needed. I also spent some time working on the backend code to get this to all join up. The final part was speaking to some teachers to understand their specific adaptation workflows and processes; this prompted me to begin drafting an 'adaptation framework' that captures this information and will guide our development process going forward. The next sprint will be focused on output quality and I will be leading on a range of prompt-engineering efforts to improve the quality of our AI-generated scaffolds. I will also begin thinking about how we can systematically evaluate these outputs over time. 

### Sprint 3

#### Ronak
In this sprint, I worked with Ritika to successfully retrieve scaffolds in our database based on the relevant lesson. We initialized a vector database in supabase that stores an embedding of activity summaries, and then using cosine similarity to match these scaffolds with the current lesson plan in question. We got this entire end-to-end process working, so now our minimum requirements of the product are complete: a teacher enters a lesson plan, we generate relevant AI scaffolds and pull up relevant human made scaffolds. For sprint 4, the main priority for me will be making everything look prettier and demo-able. 

#### Ritika
For this sprint, we were working on trying to link all of our individual moving parts together. Ronak and I first explored OpenAI’s Assistants API since we noticed saw they had a feature to help create an agent playground. We were going to integrate our RAG using the assistants API, but realized this API was more helpful for our scaffold generation instead of retrieval of existing scaffolds. After, Ronak and I worked on setting up our top-k scaffold retrieval from our supabase database. We also spent a long time linking our retrieved scaffolds and LLM scaffolds into the correct format to actually display on our website. Before, our scaffolds page was displaying manually entered scaffolds to help design the layout of the page. Now, all of the content is tailored to the link entered!

#### Riz
Over this sprint, I spent most of my time working on the prompting for our GPT-created instructional materials. This involved a lot of iteration and improvement in the OpenAI playground and reading documentation on novel prompt engineering approaches. Based on our learnings in class, I implemented a 'chain of thought' approach, involving multiple API calls which yielded significantly better outputs. We are now moving ahead with this. I also ran initial tests on the retrieval system to check for the quality and relevance of the returned materials. It looks like we need to do some additional work on this, and I'll be spending much of my time in Sprint 4 working to improve these outputs. I'll be doing this by compiling an initial test set and then adjusting the retrieval pipeline. 

### Final Sprint

#### Ronak
[Insight Report](https://docs.google.com/document/d/153eqtBhJWHnJ1sZeJDU226Y5p6-b7PkHUJg8R-PUl1A/edit?usp=sharing)

## Note on project history 
Our project builds on an existing codebase that was written by Rizwaan (and two other students) during a mini-project in CS293. The features built in this project allowed a user to input specific words about a lesson and receive three versions of a warmup task that reviews prior knowledge. Our current project has gone significantly beyond this: (1) we allow the user to input a URL which is parsed, (2) a wider range of LLM-created materials, (3) a retrieveal system where materials written by other teachers are returned to the teacher, and (4) significant UI/UX improvements. Specifically in the code, we kept the landing page the same (`src/pages/index.tsx`), but everything in `src/pages/start.tsx` and all its submodules and api calls are all brand new from this project. So that's everything in `src/pages/api/`, and everything in `src/commponents/scaffolds`. 

