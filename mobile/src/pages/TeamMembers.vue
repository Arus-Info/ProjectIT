<template>
  <div class="" v-if="props.members.length">
    <div class="bg-[#B9C8EA] flex gap-3 rounded-t-md pt-4 pb-3 pl-4">
      <FeatherIcon name="users" class="size-6 text-white" />
      <p class="text-[#4A6BB6] font-[600]">Members</p>
    </div>
    <div
      class="bg-[#F5F8FF] pt-3 pl-4 border-x-2 border-b-2 rounded-b-md shadow-[0_4px_4px_rgba(0,0,0,0.25)] border-[#B9C8EA]"
    >
      <div v-for="m in props.members" class="pb-3">
        <div class="flex gap-4" v-if="m.employee_name">
          <div class="pt-1">
            <div
              :class="[
                'rounded-full w-4 h-4',
                m.activity == 'active' ? 'bg-green-600' : 'bg-red-600',
              ]"
            ></div>
          </div>
          <p class="">{{ m.employee_name }}</p>
        </div>
        <div v-else>No Members Allocated</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { FeatherIcon } from 'frappe-ui'

const props = defineProps({
  members: Object,
})
</script>
