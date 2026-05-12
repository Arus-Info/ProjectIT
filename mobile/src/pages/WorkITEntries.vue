<template>
  <div class="pl-2 pr-2 pt-5 pb-3">
    <ListView :listData="timesheet" :header="timesheetHeader"></ListView>
  </div>
</template>
<script setup>
import { ref, inject } from 'vue'
import { createListResource } from 'frappe-ui'
import ListView from '../components/ListView.vue'

const employee = inject('employee_id')

const timesheetHeader = ref(['Date', 'Project', 'Activity Type', 'Hours'])

const timesheet = createListResource({
  doctype: 'Timesheet',
  fields: [
    'start_date',
    'parent_project.project_name',
    'time_logs.activity_type',
    'time_logs.hours',
    'modified',
  ],
  filters: { employee: employee.name },
  orderBy: 'modified desc',
  transform(data) {
    data = data.map(({ modified, ...data }) => data)
    for (let d of data) {
      d.hours = Number(d.hours.toFixed(1))
    }
    return data
  },
  auto: true,
})
</script>
