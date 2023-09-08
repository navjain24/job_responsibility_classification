from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')

def createEmbedding(sentence):
        return model.encode(sentence)
