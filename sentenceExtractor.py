from pathlib import Path
from nltk.tokenize import sent_tokenize
from common import *

def extractSentences(rootFolder):
    print('Processing root folder: %s' % rootFolder)

    for child in Path(rootFolder).iterdir():
        if child.is_file() == False:
            jobRole = child.name
            sourceFileFolder = f"{rootFolder}/{jobRole}"
            print(f"Found directory: {sourceFileFolder}")

            for p in Path(sourceFileFolder).glob('*.txt'):
                sourceFullFilePath = f"{sourceFileFolder}/{p.name}"
                extractSentencesFromSingleJob(jobRole, sourceFullFilePath)


def extractSentencesFromSingleJob(jobRole, sourceFullFilePath):
    print(f"Processing {jobRole}:{sourceFullFilePath}")

    # Create a new file for each sentence and store the same
    # The content hash of the text is the file name.
    destinationRootFolder = f"{SILVER_DATA}_2"
    makeDirIfNeeded(destinationRootFolder)

    destinationFolder = f"{destinationRootFolder}/{jobRole}"
    makeDirIfNeeded(destinationFolder)

    with open(sourceFullFilePath) as f:
        s = f.read()
        sentences = sent_tokenize(s)
        i = 0
        for sentence in sentences:
            contentHash = createHash(sentence)
            print(f"{i}: {contentHash}")
            i += 1

            fileName = f"{contentHash}.sentence"
            destinationFilePath = f"{destinationFolder}/{fileName}"

            #fs.writeFileSync(destinationFilePath, sentence)
            with open(destinationFilePath, 'w') as f:
                f.write(sentence)
                print(f"Extracted a sentence from: {sourceFullFilePath} to file: {destinationFilePath}")
 
