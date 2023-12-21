<script setup lang="ts">
//props and emits ------------------------------------------------------------------------------------
const props = defineProps({
    showTemplates: Boolean,
    promptTemplates: Array as PropType<[string, string][]>,
})
const emits = defineEmits(['clicked'])

//data ------------------------------------------------------------------------------------
const promptTemplates = ref([
    ["List some tools for sound generation", "to create drum patterns and percussion"],
    ["Are there any cheap plugins", "for pitch correction and vocal processing"],
    ["Could you recommend a tool", "for noise reduction"]
])
</script>
<template>
    <div class="w-[35%] border-r-2 border-gray-300  dark:border-gray-700 flex flex-col pt-20 px-6">
        <h1 class="uppercase text-gray-950 dark:text-gray-100 font-display text-5xl  mt-6 leading-12">
            Database for AI
            sound tools
        </h1>
        <h2 class="text-gray-950 dark:text-gray-100">by RAISE (Research on Artificial Intelligence in Sound and Musical
            Expression)</h2>
        <div class=" mt-20 flex flex-col content-stretch justify-start w-full" id="prompt-templates">
            <button v-for="template in promptTemplates"
                class="pre-wrap text-start my-5 border-2 border-gray-300 dark:border-gray-700 text-gray-950 dark:text-gray-100 px-6 rounded-2xl py-4 "
                @click="emits('clicked', template.join(' '))">
                <strong class="w-full">{{
                    template[0] }}</strong>
                <br>
                {{ template[1] }}
            </button>
        </div>
    </div>
</template>
