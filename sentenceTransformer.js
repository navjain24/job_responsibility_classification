import axios from 'axios';
import { myTransformationPipeline } from './myTransformationPipeline.js';

const model_id = "sentence-transformers/all-MiniLM-L6-v2"
const hf_token = "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"

const api_url = `https://api-inference.huggingface.co/pipeline/feature-extraction/${model_id}`;
const reqHeaders = { "Authorization": "Bearer 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" }
const config =
{
  headers: reqHeaders
};

async function getHuggingFaceEmbedding(sentence) {
  try {
    const texts = [sentence];
    const data = { "inputs": texts, "options": { "wait_for_model": "True" } };
    //const response = await axios.post(api_url, data, config);
    const response = await myTransformationPipeline(sentence);
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function createEmbedding(sentence) {
  const response = await getHuggingFaceEmbedding(sentence);
  return response;
} 
