<template>
  <div>
    <ul>
      <li v-for="d in props.dataList.data" class="pb-3">
        <div
          :class="[
            ' pt-3 pb-3 rounded-md',
            selectedValue === v
              ? ' bg-[#4A6BB6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-[#FFFFFF]'
              : 'bg-[#D6E1F9] text-[#4A6BB6]',
          ]"
          v-for="(v, k) in d"
          @click="handleClick(v)"
        >
          <p class="pl-5">{{ v }}</p>
        </div>
      </li>
    </ul>
    <div v-if="!props.noData" class="bg-[#D6E1F9] pt-4 pb-4 rounded-lg">
      <p class="text-center text-[#4A6BB6]">No Resource Found</p>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  noData: Boolean,
  dataList: Object,
})
const emit = defineEmits(['select-event'])

const selectedValue = ref('')

function handleClick(v) {
  selectedValue.value = v
  emit('select-event', selectedValue.value)
}
</script>
