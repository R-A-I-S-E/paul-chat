# RAISE DATABASE CHATBOT

This Chatbot uses:

- [OpenAIs ChatGPT API](https://github.com/openai/openai-node/blob/master/api.md)
- querying a [Chroma Vector Database](https://docs.trychroma.com/).
- It is build with the [Vercel AI SDK](https://github.com/vercel/ai)
- [Nuxt](https://nuxt.com/)
- [Tailwind](https://tailwindcss.com/) for styling.

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

## Chroma DB

The ChromaDB runs in a Docker Container. The Image is from the Chroma Github Repository as specified in this [Guide](https://docs.trychroma.com/deployment)
The Chroma SDK is used in the [api/database.ts](./api/database.ts) file to query the database.

## To Run

You need to add your OpenAI API key, a link to your chromadb and the collection name to your .env file. then run:

```bash
pnpm install
pnpm run dev
```

If you dont have pnpm installed you can use npm instead or install it from [pnpm.io](https://pnpm.io/)

## Deploy

You can deploy it to vercel with:

```bash
pnpm run build
vercel deploy
```

## Datastructure

- the app is organised with the homepage in `./pages/index.vue`
- Other routes are `./pages/help/index.vue`, `./pages/research/index.vue` and `./pages/about/index.vue`.
- ChatHistory, Header, the left Drawer and Logo have their own components in `./components/`
- there is a `./layouts/default.vue` that contains the `Header.vue`
- the api calls are made on the server in `./server/api/database.ts` and `./server/api/chat-with-functions.ts`

### Routing

To enable the links in the `Header.vue` you need to uncomment the nuxt-links andd remove the buttons.

## TODO:

Add favicon and images to public folder and load them inside the nuxt app
