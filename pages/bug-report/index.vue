<script setup lang="ts">
import DOMPurify from 'dompurify'

const input = ref('')
const data = ref()
async function sendReport(event: Event) {
  event.preventDefault()
  const cleaned = DOMPurify.sanitize(input.value)
  data.value = await useFetch('/api/bug-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: cleaned }),
  })
  input.value = ''
}
</script>

<template>
  <div v-if="data" class="flex justify-center w-full h-full items-center" :class="data.status !== 'success' ? 'bg-red-600' : ''">
    {{ data.data }}
  </div>
  <form class="fixed flex flex-row justify-center bottom-0 right-0  w-full max-w-full" @submit="sendReport">
    <input
      v-model="input"
      class=" relative w-full mx-20 mb-8 border-2 border-gray-300  dark:border-gray-700 rounded-full py-4 px-4 bg-gray-100 dark:bg-gray-950 text-gray-950 dark:text-gray-100 " placeholder="Report your bug"
    >
  </form>
</template>
