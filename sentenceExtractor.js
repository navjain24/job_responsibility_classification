//wink-nlp
import winkNlp from 'wink-nlp';

// Load english language model — light version.
import model from 'wink-eng-lite-web-model';

// Instantiate winkNLP.
const nlp = winkNlp(model);

export function extractSentences(text) {
    // Read text
    const doc = nlp.readDoc(text);

    // Extract sentences from the data
    const sentences = doc.sentences().out();

    return sentences;
}