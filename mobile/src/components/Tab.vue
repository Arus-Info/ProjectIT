<template>
  <div>
    <ul class="flex">
      <li
        v-for="t in props.tabs"
        @click="tabClicked(t)"
        :class="[
          'pt-2 pb-2 pl-3 pr-4 font-[Inter] first:pl-4 first:rounded-l-lg last:rounded-r-lg last:pr-4',
          selectedTab === t
            ? 'bg-[#4A6BB6] text-[#F2F2F2] font-[700] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
            : 'bg-[#DCDDE2] font-[400]',
        ]"
      >
        {{ t }}
      </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  tabs: Array,
})
onMounted(() => {
  selectedTab.value = props.tabs[0]
})

const emit = defineEmits(['selected-tab'])

const selectedTab = ref('')

function tabClicked(t) {
  emit('selected-tab', t)
  selectedTab.value = t
}
</script>
