import { google } from 'googleapis'
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb'

interface PluginObject {
  name: string
  category: string
  releaseDate: string
  company: string
  developers: string
  institute: string
  links: string
  'what can you do with it?': string
  'category tag': string
  'how does it work?': string
  technology: string
  'technical requirements': string
  'working environment': string
  'required knowledge': string
  'skill level': string
  'recommended knowledge': string
  'cost structure': string
  'training data': string
  'documentation level': string
  discord: string
}

async function getGoogleSheet() {
  const params = {
    spreadsheetId: useRuntimeConfig().spreadsheetId as string,
    range: 'Data',
  }
  const sheets = google.sheets({ version: 'v4', auth: useRuntimeConfig().googleAPIKey as string })
  const response = await sheets.spreadsheets.values.get(params)
  if (!response.data.values)
    return []
  return response.data.values
}

function rowtoObject(row: string[]) {
  const pluginObject = {} as PluginObject
  pluginObject.name = row[10]
  pluginObject.category = row[11]
  pluginObject.releaseDate = String(row[12])
  pluginObject.company = row[13]
  pluginObject.developers = row[14]
  pluginObject.institute = row[15]
  pluginObject.links = row[16]
  pluginObject['what can you do with it?'] = row[18]
  pluginObject['category tag'] = row[19]
  pluginObject['how does it work?'] = row[20]
  pluginObject.technology = row[21]
  pluginObject['technical requirements'] = row[22]
  pluginObject['working environment'] = row[25]
  pluginObject['required knowledge'] = row[26]
  pluginObject['skill level'] = row[27]
  pluginObject['recommended knowledge'] = row[28]
  pluginObject['cost structure'] = row[29]
  // PluginObject['cost structure 2'] = row[30];
  // PluginObject['documentation'] = row[31];
  pluginObject['training data'] = row[32]
  pluginObject['documentation level'] = row[33]
  // PluginObject['Is the creation process transparent?'] = row[34];
  if (row[36] === 'yes')
    pluginObject.discord = row[35]

  for (const key in pluginObject)
    pluginObject[key as keyof PluginObject] = cleanCell(pluginObject[key as keyof PluginObject])

  return pluginObject
}
function cleanCell(cell: string | any) {
  if (typeof cell === 'string' && cell) {
    const string = cell.replace(/\n/g, ' ')
    let cleanCell = ``
    string.split(' ').forEach((word) => {
      if (word === '\n')
        cleanCell += ' '
      else if (word === ' ')
        cleanCell += ''
      else
        cleanCell += `${word} `
    })
    cleanCell = cleanCell.trim()
    return cleanCell
  }
  else {
    return cell
  }
}
function returnArray(data: string[][]) {
  data.shift()
  data.shift()
  data.shift()
  const newData: PluginObject[] = []
  data.forEach((row) => {
    if (row && row.length > 0 && row[10])
      newData.push(rowtoObject(row))
  })

  const mdArray: string[] = []
  newData.forEach((row) => {
    let myString = ''
    for (const [key, value] of Object.entries(row))
      myString += `${key}: ${value}\n`

    mdArray.push(myString)
  })
  return mdArray
}

export default defineTask({
  meta: {
    name: 'chroma:update',
    description: 'Updates the database from google drive',
  },
  async run({ payload, context }) {
    // eslint-disable-next-line no-console
    console.log(payload, context)
    if (!useRuntimeConfig().openaiApiKey)
      throw new Error('Please provide your OpenAI API key in the .env file')
    if (!useRuntimeConfig().chromadbUrl)
      throw new Error('Please provide your Chroma URL in the .env file')
    if (!useRuntimeConfig().chromadbCollectionName)
      throw new Error('Please provide your Chroma collection name in the .env file')
    if (!useRuntimeConfig().chromadbAuth)
      throw new Error('Please provide your Chroma Auth in the .env file')
    if (!useRuntimeConfig().googleAPIKey)
      throw new Error('Please provide your Google API key in the .env file')
    const sheet = await getGoogleSheet()
    const array = await returnArray(sheet)
    const client = new ChromaClient({
      path: useRuntimeConfig().chromadbUrl,
      auth: { provider: 'token', credentials: useRuntimeConfig().chromadbAuth },
    })
    const embedder = new OpenAIEmbeddingFunction({
      openai_api_key: useRuntimeConfig().openaiApiKey,
    })

    const collection = await client.getOrCreateCollection({
      name: useRuntimeConfig().chromadbCollectionName,
      embeddingFunction: embedder,
    })

    await collection.upsert({
      ids: array.map((value, index) => {
        return `id${index}`
      }),
      documents: array,
    })
    const count = await collection.count()
    // eslint-disable-next-line no-console
    console.log(`the database has ${count} entries`)
    return { result: 'Success' }
  },
})
