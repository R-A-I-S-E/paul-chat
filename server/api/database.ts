import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb'

export default defineLazyEventHandler(async () => {
  const client = new ChromaClient({
    path: useRuntimeConfig().chromadbUrl,
    auth: { provider: 'token', credentials: useRuntimeConfig().chromadbAuth },
  }) // chromadbUrl is the url of the chromadb instance
  const openaiApiKey = useRuntimeConfig().openaiApiKey // API key for the embedding of the query
  if (!openaiApiKey)
    throw new Error('OPENAI_API_KEY is not set')
  if (!useRuntimeConfig().chromadbCollection)
    throw new Error('CHROMADB_COLLECTION is not set')
  if (!useRuntimeConfig().chromadbAuth)
    throw new Error('CHROMADB_AUTH is not set')
  const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: openaiApiKey,
  })
  const collection = await client
    .getOrCreateCollection({
      name: useRuntimeConfig().chromadbCollection, 
      embeddingFunction: embedder,
    })
    .catch((err: Error) => {
      console.error('Failed to get collection:', err)
      throw err
    })
  const count = await collection.count().catch((err: Error) => { console.error('Failed to count collection:', err); throw err })
  if (count === 0)
    runTask('chroma:update', { payload: { scheduledTime: new Date().toISOString() } })

  return defineEventHandler(async (event) => {
    const message = await readBody(event)
    const nResults: number = message.nResults || 5
    const queryTexts: string = message.queryTexts
    const response = await collection
      .query({
        queryTexts,
        nResults,
      })
      .catch((err: Error) => {
        console.error('Failed to query collection:', err)
        throw err
      })

    return { response } // response is returned to the client
  })
})
