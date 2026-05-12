<template>
  <div>
    <table class="w-full shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <tbody>
        <tr class="bg-[#4A6BB6]">
          <td
            class="first:rounded-tl-lg first:border-white last:border-white last:rounded-tr-lg pt-2 pb-2 pl-1 pr-1"
            v-for="h in header"
          >
            <p class="text-center text-white font-[600]">{{ h }}</p>
          </td>
        </tr>
        <tr v-for="line in props.listData.data" class="even:bg-[#F4F8FF]">
          <td
            :class="[
              'font-[400] pt-2 pb-2 pl-1 ',
              typeof v === 'number' ? 'text-right pr-2' : ' w-max break-words',
            ]"
            v-for="(v, k) in line"
          >
            {{ k.includes('date') ? dayjs(v).format('DD/MM/YY') : v }}
          </td>
          <td v-if="props.buttonName" class="text-center">
            <Button variant="outline" @click="emit('click-event', line)">
              {{ props.buttonName }}
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  header: Array,
  listData: Object,
  buttonName: String,
})

const emit = defineEmits(['click-event'])
</script>
<style scoped>
td {
  @apply border-[0.5px] border-[#C4C4C4];
}
</style>
