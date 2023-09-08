import * as st from './sentenceTransformer.js';

async function testEmbedding()
{
    const s1 = "My name is Abhinav Jain";
    const s2 = "Abhinav Jain is my name";

    const e1a = await st.createEmbedding(s1);
    const e1b = await st.createEmbedding(s1);
    const e2 = await st.createEmbedding(s2);


    console.log(`E1A: ${e1a.slice(0, 5)}`);
    console.log(`E1B: ${e1b.slice(0, 5)}`);
    console.log(`E2: ${e2.slice(0, 5)}`);
}

testEmbedding();