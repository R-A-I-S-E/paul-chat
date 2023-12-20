import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from 'chromadb';

export default defineLazyEventHandler(async () => {
  const client = new ChromaClient({ path: useRuntimeConfig().chromadbUrl });
  const openaiApiKey = useRuntimeConfig().openaiApiKey;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: openaiApiKey
  });
  const collection = await client
    .getCollection({
      name: useRuntimeConfig().chromadbCollectionName,
      embeddingFunction: embedder
    })
    .catch((err: Error) => {
      console.error('Failed to get collection:', err);
      throw err;
    });

  return defineEventHandler(async (event) => {
    const message = await readBody(event);
    const nResults: number = message.nResults || 5;
    const queryTexts: string = message.queryTexts;
    const response = await collection
      .query({
        queryTexts: queryTexts,
        nResults: nResults
      })
      .catch((err: Error) => {
        console.error('Failed to query collection:', err);
        throw err;
      });

    return { response };
  });
});
