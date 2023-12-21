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
    <div class="w-1/3 border-r-2 border-gray-300  dark:border-gray-700 flex flex-col pt-20">
        <h2 class="uppercase text-gray-950 dark:text-gray-100 font-display text-5xl ml-6 mt-6 leading-12">Database for AI
            sound tools
        </h2>
        <div class=" mt-20 flex flex-col content-stretch justify-start" id="prompt-templates">
            <button v-for="template in promptTemplates"
                class="pre-wrap text-start mx-20  my-5 border-2 border-gray-300 dark:border-gray-700 text-gray-950  dark:text-gray-100  px-12 rounded-3xl py-8 "
                @click="emits('clicked', template.join(' '))">
                <strong class="w-full">{{
                    template[0] }}</strong>
                <br>
                {{ template[1] }}
            </button>
        </div>
    </div>
</template>
