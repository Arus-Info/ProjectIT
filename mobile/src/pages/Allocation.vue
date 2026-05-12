<template>
  <div class="flex flex-row gap-4 justify-end">
    <Button variant="outline" @click="collapse">Collapse</Button>
    <Button variant="outline" @click="expand">Expand</Button>
  </div>
  <div v-for="(p, index) in projectAllocationResource.data" class="pt-3">
    <div
      :class="[
        'flex gap-3 pt-2 pb-2 pl-3 pr-3 border-2 border-[#D6E1F9]',
        p.dropdown ? 'bg-[#adbde0] rounded-t-md' : ' rounded-md',
      ]"
      @click="projectSelected(index)"
    >
      <FeatherIcon class="w-6 h-6" name="chevron-right" v-if="!p.dropdown" />
      <FeatherIcon class="w-6 h-6" name="chevron-down" v-if="p.dropdown" />
      <p>{{ p.project_name }}</p>
    </div>
    <div
      v-if="p.dropdown"
      class="pt-3 pb-3 pl-4 pr-4 border-2 border-[#D6E1F9] rounded-b-md bg-[#D6E1F9]"
    >
      <TeamMembers :members="p.members"></TeamMembers>
    </div>
  </div>
</template>
<script setup>
import { createResource, FeatherIcon } from 'frappe-ui'
import { inject } from 'vue'
import TeamMembers from './TeamMembers.vue'

const employee = inject('employee_id')

const projectAllocationResource = createResource({
  url: 'projectit.api.project_with_members',
  makeParams() {
    return {
      employee_id: employee.name,
    }
  },
  transform(data) {
    for (let d of data) {
      d.members = JSON.parse(d.members)
      d.dropdown = true
    }
    return data
  },
  auto: true,
})

function projectSelected(index) {
  projectAllocationResource.data[index].dropdown =
    !projectAllocationResource.data[index].dropdown
}

function expand() {
  for (let d of projectAllocationResource.data) {
    d.dropdown = true
  }
}

function collapse() {
  for (let d of projectAllocationResource.data) {
    d.dropdown = false
  }
}
</script>
