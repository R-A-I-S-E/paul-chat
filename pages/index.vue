<script setup lang="ts">
// imports ------------------------------------------------------------------------------------
import { useChat } from 'ai/vue';
import { nanoid } from 'ai';
import { marked } from 'marked';
import DOMPurify from 'dompurify'
import type { FunctionCallHandler, Message } from 'ai';
import type { DatabaseResponse, Input } from '../types';
//data------------------------------------------------------------------------------------
const promptTemplates = ref([
  ["List some tools for sound generation", "to create drum patterns and percussion"], ["Are there any cheap plugins", "for pitch correction and vocal processing"],
  ["Could you recommend a tool", "for noise reduction"]
])
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
  <main class=" bg-[#fafafa] h-screen  h-dvh w-full flex flex-row">
    <header class="fixed top-0 left-0 right-0 h-20 bg-red-500 z-50"> </header>
    <!-- Starter Window  with TODO: Prompt templates-->
    <div class="w-1/3 bg-green-500 flex flex-col pt-20">
      <div class=" mt-20 flex flex-col content-stretch justify-start" id="prompt-templates"
        v-if="onlyUserAndAssistant.length <= 0">
        <button v-for="template in promptTemplates" class="pre-wrap text-start mx-20  my-5" @click="handleClick"> <strong
            class="w-full">{{
              template[0] }}</strong>
          <br>
          {{ template[1] }}
        </button>
      </div>
    </div>
    <!-- Chat History: -->
    <div class="flex flex-col w-2/3 px-40 pt-60 pb-24 mx-auto stretch overflow-y-scroll">
      <div v-for="m in onlyUserAndAssistant" key="m.id"
        class="[&>ul]:leading-6 [&>ul]:list-disc [&>ol]:leading-6 [&>ol]:list-decimal [&>*]:mb-2"
        :style="{ color: roleToColorMap[m.role] }" v-html="parseMarkdown(m.role, m.content)">
      </div>
      <!-- Input -->
      <form @submit="handleSubmit">
        <input class="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded" v-model="input"
          placeholder="Say something..." />
      </form>
    </div>
  </main>
</template> 
