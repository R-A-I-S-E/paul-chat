<script setup lang="ts">
// imports ------------------------------------------------------------------------------------
import { useChat } from 'ai/vue';
import { nanoid } from 'ai';

import type { FunctionCallHandler, Message } from 'ai';
import type { DatabaseResponse, Input } from '../types';
//data------------------------------------------------------------------------------------

//methods ------------------------------------------------------------------------------------
const querryDataBase = async (_input: Input) => {
  if (!_input.queryTexts) throw new Error('no input provided')
  const response = await useFetch('/api/database', {
    method: 'POST', headers: {
      'Content-Type': 'application/json',
    }, body: JSON.stringify({ queryTexts: _input.queryTexts, nResults: _input.nResults })

  }) as { data: { value: DatabaseResponse } }
  return response?.data?.value?.["response"]["documents"]
};

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
      };
      return functionResponse;
    }
  }
};

const { messages, input, handleSubmit, append } = useChat({
  api: '/api/chat-with-functions',
  experimental_onFunctionCall: functionCallHandler,
  initialMessages: [
    {
      id: nanoid(),
      role: 'system',
      content: 'Only aswer questions that relate to the database context! Dont lie and only use information from the database',
    }, {
      id: nanoid(),
      role: 'system',
      content: 'talk like a all knowing music database, dont say to the user you are searching one. Query more that you need and then filter the results',
    },
    {
      id: nanoid(),
      role: 'system',
      content: 'Structure your answers in markdown',
    }]
});

//lifecycle ------------------------------------------------------------------------------------

</script>

<template >
  <main class=" bg-gray-100 dark:bg-gray-950 h-screen  h-dvh w-full flex flex-row">
    <Header />
    <LeftDrawer @clicked="append({ content: $event, role: 'user' })" :show-templates="true" />
    <!-- Chat History: -->
    <ChatHistory :messages="messages">
      <!-- Input -->
      <form @submit="handleSubmit" class="fixed bottom-0 left-2/3 -translate-x-1/2 w-full max-w-md">
        <input class="w-full  mb-8 border border-gray-300 rounded py-1 px-0.5 bg-gray-100 dark:bg-gray-950 "
          v-model="input" placeholder="Say something..." />
      </form>
    </ChatHistory>
  </main>
</template> 
