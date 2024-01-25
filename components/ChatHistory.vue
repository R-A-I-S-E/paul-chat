<script setup lang="ts">
// imports ------------------------------------------------------------------------------------
import type { Message } from 'ai'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// props and emits ------------------------------------------------------------------------------------
const props = defineProps<{
  messages: Message[]

}>()
// methods ------------------------------------------------------------------------------------
const onlyUserAndAssistant = computed(() => {
  let filtered = props.messages.filter(m => m.role === 'user' || m.role === 'assistant')
  filtered = filtered.filter(m => !m.function_call)
  return filtered
})
function parseMarkdown(role: string, content: string) {
  const roleString = role === 'user' ? '<strong style="color: blue">YOU:</strong>' : '<strong style="color: lightgrey">RAISE:</strong>'
  const firstChar = content.charAt(0)
  let combined: string = ''
  if (firstChar.match(/[0-9#-]/))
    combined = `${roleString} \n ${content}`

  else
    combined = `${roleString} ${content}`

  const markdown = marked.parse(combined) as string
  return DOMPurify.sanitize(markdown)
}
</script>

<template>
  <div class="relative flex flex-col w-[65%] px-40 pt-60 pb-24 mx-auto stretch overflow-y-scroll">
    <Logo v-if="onlyUserAndAssistant.length <= 0" />
    <div
      v-for="m in onlyUserAndAssistant" :key="m.id"
      class="[&>a]:underline [&>ul>*]:ml-4 [&>ul]:leading-6 [&>ul]:list-disc [&>ul]:list-outside [&>ol>*]:ml-4  [&>ol]:leading-6 [&>ol]:list-decimal [&>ol]:list-outside [&>h3]:text-xl [&>h3]:font-bold  [&>*]:mb-2  [&:*]:text-gray-950 dark:text-gray-100"
      v-html="parseMarkdown(m.role, m.content)"
    />
    <slot />
  </div>
</template>
