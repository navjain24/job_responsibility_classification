import * as st from './sentenceTransformer.js';
import * as math from './math.js';

async function testEmbedding() {
    const s1 = "Write code in TypeScript"; //Control
    const s2 = "Develop code using Java"; // Treatment

    const e1a = await st.createEmbedding(s1);
    const e1b = await st.createEmbedding(s1);
    const e2 = await st.createEmbedding(s2);


    console.log(`E1A: ${e1a.slice(0, 5)}`);
    console.log(`E1B: ${e1b.slice(0, 5)}`);
    console.log(`E2: ${e2.slice(0, 5)}`);

    let simScore1 = math.cosineSimilarity(e1a, e1b);
    console.log(`Similarity Score: E1A <-> E1B: ${simScore1}`);

    let simScore2 = math.cosineSimilarity(e1a, e2);
    console.log(`Similarity Score: E1A <-> E2: ${simScore2}`);

}

testEmbedding();