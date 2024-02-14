<script setup lang="ts">
const route = useRoute()
const navigation = computed(() => {
  if (route.fullPath === '/bug-report')
    return [{ label: 'research', route: 'research' }, { label: 'chat', route: '' }]
  else
    return [{ label: 'research', route: 'research' }, { label: 'bug report', route: 'bug-report' }]
})
</script>

<template>
  <header
    class="bg-gray-100 dark:bg-gray-950 fixed top-0 left-0 right-0 h-20 z-50 border-b-2 border-gray-300 dark:border-gray-700  flex flex-row justify-end px-10"
  >
    <nav class="flex flex-row gap-3 items-center">
      <!-- <nuxt-link v-for="element in navigation" :key="element.label" :to="`/${element.route}`"
                class="uppercase text-gray-300 dark:text-gray-700 border-2 border-gray-300 dark:border-gray-700 py-2 px-4 rounded-3xl text-xl font-medium">
                {{ element.label }}</nuxt-link> -->
      <NuxtLink
        v-for="element in navigation" :key="element.label" :to="`/${element.route}`"
        class="uppercase text-gray-300 dark:text-gray-700 border-2 border-gray-300 dark:border-gray-700 py-2 px-4 rounded-3xl text-xl font-medium"
      >
        {{ element.label }}
      </NuxtLink>
      <a href="https://www.hfg-offenbach.de/de/pages/raise-ki-forschung-sound-und-musik#ueber" target="_blank" class="uppercase text-gray-300 dark:text-gray-700 border-2 border-gray-300 dark:border-gray-700 py-2 px-4 rounded-3xl text-xl font-medium">about</a>
    </nav>
  </header>
</template>
