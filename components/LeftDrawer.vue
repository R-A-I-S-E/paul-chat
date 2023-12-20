<script setup lang="ts">
const props = defineProps({
    showTemplates: Boolean,
    promptTemplates: Array as PropType<[string, string][]>,
})
const emits = defineEmits(['clicked'])
const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    const target = e.target as HTMLButtonElement
    emits('clicked', target.innerText as string)
}
//data ------------------------------------------------------------------------------------
const promptTemplates = ref([
    ["List some tools for sound generation", "to create drum patterns and percussion"], ["Are there any cheap plugins", "for pitch correction and vocal processing"],
    ["Could you recommend a tool", "for noise reduction"]
])
</script>
<template>
    <div class="w-1/3 border-r-2 border-gray-300  dark:border-gray-700 flex flex-col pt-20">
        <div class=" mt-20 flex flex-col content-stretch justify-start" id="prompt-templates" v-if="showTemplates">
            <button v-for="template in promptTemplates"
                class="pre-wrap text-start mx-20  my-5 border-2 border-gray-300 dark:border-gray-700  px-12 rounded-3xl py-8"
                @click="handleClick">
                <strong class="w-full">{{
                    template[0] }}</strong>
                <br>
                {{ template[1] }}
            </button>
        </div>
    </div>
</template>
