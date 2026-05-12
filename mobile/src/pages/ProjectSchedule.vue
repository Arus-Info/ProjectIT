<template>
  <div class="pl-3 pr-3 pt-5">
    <ListView
      :listData="scheduleResource"
      :header="scheduleHeader"
      buttonName="Instructions"
      @click-event="projectSelected($event)"
    ></ListView>
  </div>
  <Dialog
    v-model="showInstructions"
    :options="{
      actions: [
        {
          label: 'OK',
          variant: 'solid',
          onClick: () => {
            showInstructions = false
          },
        },
      ],
    }"
  >
    <template #body-title>
      <p class="font-mono font-bold text-xl">Instructions</p>
    </template>
    <template #body-content>
      <Instructions :instructions="instructions"></Instructions>
    </template>
  </Dialog>
</template>
<script setup>
import { createResource, Dialog } from 'frappe-ui'
import { ref, inject } from 'vue'
import ListView from '../components/ListView.vue'
import dayjs from 'dayjs'
import { get_instructions } from '../data/work_instructions'
import Instructions from './Instructions.vue'

const employee = inject('employee_id')
const scheduleHeader = ref(['Project', 'Instructions'])
const instructions = ref({})

const showInstructions = ref(false)

const scheduleResource = createResource({
  url: 'projectit.api.get_employee_schedule',
  makeParams() {
    return {
      date: dayjs().format('YYYY-MM-DD'),
      employee_id: employee.name,
    }
  },
  auto: true,
})

function projectSelected(p) {
  let promise = get_instructions(
    p.allocation_date,
    p.project_name,
    employee.name
  )
  promise.then((d) => {
    instructions.value = d
    showInstructions.value = true
  })
}
</script>
