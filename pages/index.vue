<script setup lang="ts">
// imports 
import { useChat } from 'ai/vue';
import { nanoid } from 'ai';
import type { FunctionCallHandler, Message } from 'ai';
import type { DatabaseResponse, Input } from '../types';

const querryDataBase = async (_input: Input) => {
  if (!_input.queryTexts) throw new Error('no input provided')
  const response = await useFetch('/api/database', {
    method: 'POST', headers: {
      'Content-Type': 'application/json',
    }, body: JSON.stringify({ queryTexts: _input.queryTexts, nResults: _input.nResults })

  }) as { data: { value: DatabaseResponse } }
  console.log(response.data.value)

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

const { messages, input, handleSubmit } = useChat({
  api: '/api/chat-with-functions',
  experimental_onFunctionCall: functionCallHandler,
});

// Generate a map of message role to text color
const roleToColorMap: Record<Message['role'], string> = {
  system: 'red',
  user: 'black',
  function: 'blue',
  assistant: 'green',
  data: 'orange',
};
onMounted(async () => {
  messages.value.push({
    id: nanoid(),
    role: 'system',
    content: 'Only aswer questions that relate to the database context! Dont lie and only use information from the database',
  });
  messages.value.push({
    id: nanoid(),
    role: 'system',
    content: 'talk like a all knowing music database, dont say to the user you are searching one. Query more that you need and then filter the results',
  });
})

</script>

<template>
  <div class="flex flex-col w-full max-w-md py-24 mx-auto stretch">
    <div v-for="m in messages" key="m.id" class="whitespace-pre-wrap" :style="{ color: roleToColorMap[m.role] }">
      <strong>{{ m.role }}:</strong>
      {{ m.content || JSON.stringify(m.function_call) }}
      <br />
      <br />
    </div>

    <form @submit="handleSubmit">
      <input class="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl" v-model="input"
        placeholder="Say something..." />
    </form>
  </div>
</template>
