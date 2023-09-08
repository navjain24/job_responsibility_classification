from pathlib import Path


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
 

extractSentences('./BRONZE_DATA')
