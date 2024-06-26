<script setup lang="ts">
// imports ------------------------------------------------------------------------------------
import { useChat } from 'ai/vue'
import { nanoid } from 'ai'

import type { FunctionCallHandler, Message } from 'ai'

export interface Input {
  queryTexts: string
  nResults: number
}
export interface Metadatas { name: string } // metadatas can be added in the ingest process if you want to have here more information
export interface DatabaseResponse {
  response: {
    ids: string[]
    distances: number[][]
    documents: string[]
    metadatas: Metadatas[] | null
    embeddings: number[][] | null
    data: any | null
    uris: any | null
  }
}

// data------------------------------------------------------------------------------------

// methods ------------------------------------------------------------------------------------
async function querryDataBase(_input: Input) {
  if (!_input.queryTexts)
    throw new Error('no input provided')
  const response = await useFetch('/api/database', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ queryTexts: _input.queryTexts, nResults: _input.nResults }),

  }) as { data: { value: DatabaseResponse } }
  return response?.data?.value?.response.documents
}

const functionCallHandler: FunctionCallHandler = async (
  chatMessages,
  functionCall,
) => {
  if (functionCall.name === 'querryDataBase') {
    if (functionCall.arguments) {
      // Parsing here does not always work since it seems that some characters in generated code aren't escaped properly.
      const res = await querryDataBase(JSON.parse(functionCall.arguments))
      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'querryDataBase',
            role: 'function' as const,
            content: res.join('\n'),
          },
        ],
      }
      return functionResponse
    }
  }
}

const { messages, input, handleSubmit, append } = useChat({
  api: '/api/chat-with-functions',
  experimental_onFunctionCall: functionCallHandler,
  initialMessages: [
    {
      id: nanoid(),
      role: 'system',
      content: 'Only aswer questions that relate to the database context! Dont lie and only use information from the database',
    },
    {
      id: nanoid(),
      role: 'system',
      content: 'talk like a all knowing music database, dont say to the user you are searching one. Query more that you need and then filter the results',
    },
    {
      id: nanoid(),
      role: 'system',
      content: 'Structure your answers in markdown',
    },
  ],
})

// lifecycle ------------------------------------------------------------------------------------
</script>

<template>
  <LeftDrawer :show-templates="true" @clicked="append({ content: $event, role: 'user' })" />
  <!-- Chat History: -->
  <ChatHistory :messages="messages">
    <!-- Input -->
    <form class="fixed flex flex-row justify-center bottom-0 right-0  w-full max-w-[65%]" @submit="handleSubmit">
      <input
        v-model="input"
        class=" relative w-full mx-20 mb-8 border-2 border-gray-300  dark:border-gray-700 rounded-full py-4 px-4 bg-gray-100 dark:bg-gray-950 text-gray-950 dark:text-gray-100 " placeholder="Ask me anything about AI sound tools..."
      >
    </form>
  </ChatHistory>
</template>
