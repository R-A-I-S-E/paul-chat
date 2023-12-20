import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData
} from 'ai';
import OpenAI from 'openai';
import type { ChatCompletionCreateParams } from 'openai/resources/chat';

const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: 'querryDataBase',
    description:
      'querrys the vector database of music production plugins that work with ai. to find the nearest neighbors to the query text.' +
      'Every plugin text contains: name, category, releaseDate, company, developers, what can you do with it?,category tag, how does it work?, technology, technicalRequirements,required knowledge,skill level,recommended knowledge,cost structure',
    parameters: {
      type: 'object',
      properties: {
        queryTexts: {
          type: 'string',
          description:
            'The text to search for in the database. It retrieves the nearest neighbors to this text.'
        },
        nResults: {
          type: 'number',
          description: 'The number of results to return, if not specified 5'
        }
      },
      required: ['queryTexts']
    }
  }
];

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const openai = new OpenAI({
    apiKey: apiKey
  });

  return defineEventHandler(async (event: any) => {
    const { messages } = await readBody(event);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      stream: true,
      messages,
      functions
    });

    const data = new experimental_StreamData();
    const stream = OpenAIStream(response, {
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages
      ) => {},
      onCompletion(completion) {
        console.log('completion', completion);
      },
      onFinal(completion) {
        data.close();
      },
      experimental_streamData: true
    });

    data.append({
      text: 'Hello, how are you?'
    });

    return new StreamingTextResponse(stream, {}, data);
  });
});
