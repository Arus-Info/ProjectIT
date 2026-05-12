<template>
  <div
    class="bg-[#B9C8EA] pt-3 pb-3 pl-4 rounded-t-md flex gap-3"
    v-if="props.instructions"
  >
    <InstructionsIcon class="h-6 w-6"></InstructionsIcon>
    <p class="font-[Inter] font-[600] text-[#4A6BB6]">Instructions</p>
  </div>
  <div class="bg-[#F5F8FF] rounded-b-md border-[#B9C8EA] border-b-2 border-x-2">
    <div v-for="instruction in props.instructions" class="pl-3 pr-5 pt-4 pb-5">
      <div v-for="(i, k) in instruction" class="pb-5">
        <div
          class="bg-[#D6E1F9] pt-3 pb-3 pl-5 pr-5 w-[200px] shadow-[0_0_4px_rgba(0,0,0,0.25)]"
        >
          {{
            k === 'work_instruction'
              ? 'Project Instructions'
              : 'Specific Instructions '
          }}
        </div>
        <div class="bg-[#FFFFFF] pt-2 pb-2 pl-3 pr-3">
          <div v-if="i">{{ i }}</div>
          <div v-else>No Instructions Found</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import InstructionsIcon from './icons/InstructionsIcon.vue'

const props = defineProps({
  instructions: Object,
})
</script>
