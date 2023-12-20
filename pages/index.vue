<script setup lang="ts">
// imports ------------------------------------------------------------------------------------
import { useChat } from 'ai/vue';
import { nanoid } from 'ai';
import { marked } from 'marked';
import DOMPurify from 'dompurify'
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
const handleClick = (e: Event) => {
  e.preventDefault()
  const target = e.target as HTMLButtonElement
  console.log(target.innerText)
  append({ content: target.innerText, role: 'user' })
}
// Generate a map of message role to text color
const roleToColorMap: Record<Message['role'], string> = {
  system: 'red',
  user: 'black',
  function: 'blue',
  assistant: 'green',
  data: 'orange',
};

const onlyUserAndAssistant = computed(() => {
  let filtered = messages.value.filter(m => m.role === 'user' || m.role === 'assistant')
  filtered = filtered.filter(m => !m.function_call)
  return filtered
})
const parseMarkdown = (role: string, content: string) => {
  const roleString = role === 'user' ? 'YOU' : 'RAISE'
  const combined = `**${roleString}**: ${content}`
  const markdown = marked.parse(combined) as string
  return DOMPurify.sanitize(markdown)
}

//lifecycle ------------------------------------------------------------------------------------
onMounted(() => {

})

</script>

<template >
  <main class=" bg-gray-100 dark:bg-gray-900 h-screen  h-dvh w-full flex flex-row">
    <Header />

    <LeftDrawer @clicked="append({ content: $event, role: 'user' })" :show-templates="onlyUserAndAssistant.length <= 0" />
    <!-- Chat History: -->
    <div class="relative flex flex-col w-2/3 px-40 pt-60 pb-24 mx-auto stretch overflow-y-scroll">
      <img v-if="onlyUserAndAssistant.length <= 0" id="Logo"
        class="absolute top-1/2 left-1/2 -z-1 w-100 -translate-x-1/2 -translate-y-1/2 opacity-20" src="/raiselogo.svg">
      <div v-for="m in onlyUserAndAssistant" key="m.id"
        class="[&>ul]:leading-6 [&>ul]:list-disc [&>ol]:leading-6 [&>ol]:list-decimal[&>h3]:text-xl [&>h3]:font-bold  [&>*]:mb-2 "
        :style="{ color: roleToColorMap[m.role] }" v-html="parseMarkdown(m.role, m.content)">
      </div>
      <!-- Input -->
      <form @submit="handleSubmit" class="fixed bottom-0 left-2/3 -translate-x-1/2 w-full max-w-md">
        <input class="w-full  mb-8 border border-gray-300 rounded py-1" v-model="input" placeholder="Say something..." />
      </form>
    </div>
  </main>
</template> 
