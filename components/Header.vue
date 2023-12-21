<script setup lang="ts">
const buttons = ref([{ label: "help" }, { label: "research" }, { label: "about" }])
</script>

<template>
    <header
        class="bg-gray-100 dark:bg-gray-950 fixed top-0 left-0 right-0 h-20 z-50 border-b-2 border-gray-300 dark:border-gray-700  flex flex-row justify-end px-10">
        <nav class="flex flex-row gap-3 items-center">
            <button v-for="button in buttons"
                class="uppercase text-gray-300 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-700 py-2 px-4 rounded-3xl text-lg font-medium">
                {{ button.label }}</button>
        </nav>
    </header>
</template>