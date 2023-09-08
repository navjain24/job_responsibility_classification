from pathlib import Path


def extractSentences(rootFolder):
    print('Processing root folder: %s' % rootFolder)

    for child in Path(rootFolder).iterdir():
        if child.is_file() == False:
            print(f"{child.name}")
            for p in Path(f"{rootFolder}/{child.name}").glob('*.txt'):
                print(f"{p.name}")
 

extractSentences('./BRONZE_DATA/')
