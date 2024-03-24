# RAISE DATABASE CHATBOT

This Chatbot uses:

- [OpenAIs ChatGPT API](https://github.com/openai/openai-node/blob/master/api.md)
- querying a [Chroma Vector Database](https://docs.trychroma.com/).
- It is build with the [Vercel AI SDK](https://github.com/vercel/ai)
- [Nuxt](https://nuxt.com/)
- [Tailwind](https://tailwindcss.com/) for styling.
- [Docker](https://www.docker.com/) for deployment.

## To Run

1. clone the repository
2. **You need to add the enviroment variables**, for that you need to create a `.env` file in the root of the project. The needed variables  are in the `.env.example` file.
3. make shure you have docker and it is running
4. run `docker-compose up --build` in your terminal in the root of the project.
5. you can now open the chatbot in your browser at `http://localhost:5454`

## how it works

It uses the feature [function-calling](https://platform.openai.com/docs/guides/function-calling) to enable the model to query the Database with the `querryDataBase()`function. The model can give it own inputs to the function. The function is described in a json schema:

```TypeScript
const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: 'querryDataBase',
    description:
      'querrys the vector database of music production plugins that work with ai. to find the nearest neighbors to the query text.' +
      'Every plugin text contains: name, category, releaseDate, company, developers, what can you do with it?, category tag, how does it work?, technology, technicalRequirements, required knowledge,skill level, recommended knowledge, cost structure',
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
```
