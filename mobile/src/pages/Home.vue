<template>
  <div class=" sm:w-96 font-[Inter]">
    <div class=" pt-[16px] flex flex-col items-center justify-center">
      <div
        class=" w-[322px] h-11 bg-[#F2F2F2] flex items-center justify-center shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        <p class="text-[#4A6BB6] font-[800] text-2xl">ProjectIT</p>
      </div>
      <div class="pt-[30px]">
        <div class=" text-center">
          <img src="../images/home_page.png" />
        </div>
      </div>
    </div>
    <div v-if="! mobileModules.list.loading">
      <div class=" pt-15 flex justify-evenly " v-if="mobileModules.data && employee.name">
        <ThemeButton v-if="mobileModules.data.includes('WorkIT')" name="WorkIT" @click="router.push({ name: 'WorkIT' })">
        </ThemeButton>
        <ThemeButton v-if="mobileModules.data.includes('ManageIT')" name="ManageIT"
          @click="router.push({ name: 'ManageIT' })"></ThemeButton>
      </div>
      <div v-else class="pt-10 pl-6 pr-6">
        <div class=" pt-3 pb-4 border-2 border-[#B9C8EA] text-center rounded-lg bg-[#D6E1F9] font-[Inter] font-[600]">
          You are not an Employee
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { inject } from 'vue'
import { createResource, createListResource } from 'frappe-ui'
import { useRouter } from 'vue-router'
import { userResource } from '../data/user'
import ThemeButton from '../components/ThemeButton.vue'
import { moduleName } from '../data/module'

moduleName.value = ''

const router = useRouter()

const employee = inject('employee_id')

const employeeResource = createResource({
  type: "POST",
  url: "projectit.api.get_employee_id",
  makeParams() {
    return {
      user_id: userResource.data
    }
  },
  onSuccess(d) {
    employee.name = d
    mobileModules.update({
      filters : {"name" : employee.name}
    })
    mobileModules.fetch()
  },
  auto: true,
})

const mobileModules = createListResource({
  doctype : "Employee",
  fields : ['custom_mobile_module.module_name'],
  transform(data){
    let t_data = []
    for(let d of data){
      t_data.push(d.module_name)
    }
    return t_data
  },
  onSuccess(data){
    if(data.length === 1){
      router.replace({name : data[0]})
    }
  },
})

</script>
