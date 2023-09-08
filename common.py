import hashlib
import os

BRONZE_DATA = 'BRONZE_DATA'
SILVER_DATA = 'SILVER_DATA'
GOLD_DATA = 'GOLD_DATA'


def createHash(text):
    hash = hashlib.md5(text.encode()).hexdigest()
    return hash

def makeDirIfNeeded(dirName):
    try:
        os.mkdir(dirName)
    except FileExistsError:
        print("Folder %s already exists" % dirName)