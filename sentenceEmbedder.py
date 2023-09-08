from pathlib import Path
from common import *
from embedder import *
import numpy as np


def embedSentences(rootFolder):
    print('Processing root folder: %s' % rootFolder)

    for child in Path(rootFolder).iterdir():
        if child.is_file() == False:
            jobRole = child.name
            sourceFileFolder = f"{rootFolder}/{jobRole}"
            print(f"Found directory: {sourceFileFolder}")

            for p in Path(sourceFileFolder).glob('*.sentence'):
                sourceFullFilePath = f"{sourceFileFolder}/{p.name}"
                embedSentencesFromSingleJob(jobRole, sourceFullFilePath)


def embedSentencesFromSingleJob(jobRole, sourceFullFilePath):
    print(f"Processing {jobRole}:{sourceFullFilePath}")

    # Create a new file for each sentence and store the same
    # The content hash of the text is the file name.
    destinationRootFolder = GOLD_DATA
    makeDirIfNeeded(destinationRootFolder)

    destinationFolder = f"{destinationRootFolder}/{jobRole}"
    makeDirIfNeeded(destinationFolder)

    with open(sourceFullFilePath) as f:
        s = f.read()
        embedding = createEmbedding(s)
        contentHash = createHash(s)
        print(f"{contentHash}:{embedding}")
        fileName = f"{contentHash}.embedding"
        destinationFilePath = f"{destinationFolder}/{fileName}"

        with open(destinationFilePath, 'w') as f:
            f.write(np.array2string(embedding))
            print(f"Embedded the sentence from: {sourceFullFilePath} to file: {destinationFilePath}")
     