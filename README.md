This is my GitHub project.

Here is the updated pipeline (https://github.com/navjain24/job_responsibility_classification):
1. Using Puppeteer, scrap job search page from Indeed.com for the following job roles:
        "DevOps+Engineer",
        "Data+Engineer",
        "Cloud+Engineer", 
        "Site-reliability+Engineer", 
        "AI+Engineer"
     2. Using Cheerio, extract job ids within each job role HTML.
     3. Using Puppeteer, for each job id, visit the job detail page on indeed.com and scrap the html. Store the HTML in individual files (RAW_JOB_ DATA).
     4. Using Cheerio, for each HTML file, extract the job description text and store it in a .txt file (BRONZE_DATA).
     5. Using NLTK (Python), break job description into sentences.
      a. Currently, it does not seem very accurate (same as winkNlp). May need to be replaced with a better extractor.
     6. Store each sentence into a separate file (SILVER_DATA) using content hash (MD5) as the file name.
     7. For each .sentence file, create embeddings for each sentence (file content) using S-BERT (https://www.sbert.net/docs/quickstart.html)
      
        With S-BERT python library, the embedding length is fixed and thus comparable using cosine.
         Also created functions to calculate similarity using cosine.
        Store each embedding into its own file with the .embedding extension in GOLD_DATA folder.

Next:
Use the master list to generate embeddings (waiting on you) for each master job responsibility.
Compare each embedding with master list embeddings and rank the embeddings with a similarity score
Generate a report with top N job responsibilities per job role.
