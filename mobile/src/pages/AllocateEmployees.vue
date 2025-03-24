<template>
    <div class=" pt-5 pb-5 pl-3 pr-3">
        <div class="bg-[#B9C8EA] pt-2 pb-3 text-center rounded-t-lg">
            <p class="text-[#4A6BB6] font-[600]">{{ route.params.project_name }}</p>
        </div>
        <div class="border-x-2 border-b-2 border-[#B9C8EA] bg-[#F5F8FF] pt-3 pb-3 pl-3 pr-3 rounded-b-lg">
            <div class="text-right">
                <PrimaryButton name="+ New" @click="employeeResource.fetch();showNewAllocation = true"></PrimaryButton>
            </div>
            <div class="pb-3"></div>
            <div class="pt-2 pb-1 pl-2 pr-2" v-if="showNewAllocation">
                <div class="flex items-center gap-3 bg-white pt-4 pb-2 pl-4">
                    <p>Select Employee</p>
                    <select v-model="allocationEmployee" class="w-40">
                        <option :value="e.name" v-for="e in employeeResource.data">{{ e.employee_name }}</option>
                    </select>
                </div>
                <textarea class="w-full" v-model="instruction"></textarea>
                <div class="pt-2 text-center">
                    <PrimaryButton name="Add" @click="add"></PrimaryButton>
                </div>
            </div>
            <div v-if="employeeInstructionListResource.data">
                <ul class="pt-5 pl-4 pr-4 pb-4">
                    <li v-for="e in employeeInstructionListResource.data" class="pb-3">
                        <div class="bg-[#D6E1F9] text-[#4A6BB6] pt-3 pb-3 pl-5 pr-5 rounded-md flex items-center">
                            <p>{{ e.employee_name }}</p>
                            <div class="w-full flex justify-end">
                                <FeatherIcon name="user-minus" class="w-6 h-6" @click="remove(e.name)" />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <Dialog :options="{
        title: 'Confirm',
        message: 'Are you sure you want to remove the employee ?',
        size: 'xl',
        icon: {
            name: 'alert-triangle',
            appearance: 'warning',
        },
        actions: [
            {
                label: 'Confirm',
                variant: 'solid',
                onClick: () => {
                    employeeInstructionListResource.delete.submit(employeeInstructionId);
                    showRemove = false;
                },
            },
        ],
    }" v-model="showRemove" />
</template>
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { createResource,createListResource, FeatherIcon, Dialog } from 'frappe-ui';
import PrimaryButton from '../components/PrimaryButton.vue';

const route = useRoute();

const projectInstructionId = ref(null);

const employeeInstructionId = ref();

const showNewAllocation = ref(false)
const showRemove = ref(false)

const instruction = ref('')
const allocationEmployee = ref('')

const employeeResource = createResource({
    url: "projectit.api.get_employee_with_workit",
    makeParams() { return { "project_name": route.params.project_name } }

})


const projectAllocationInstructionResource = createListResource({
    doctype : "Project Allocation and Instrucions",
    filters : {"project_name" : route.params.project_name},
    fields : ["name"],
    auto : true,
    onSuccess(d){
        projectInstructionId.value = d[0].name
        employeeInstructionListResource.fetch()
    },
})

const employeeInstructionListResource = createListResource({
    doctype : "Employee Allocation Instruction",
    parent : "Project Allocation and Instrucions",
    filters : { parent : projectInstructionId},
    fields :["employee_name", "name"],
    insert : {
        onSuccess(){
            instruction.value = ''
            employeeResource.fetch()
        }
    },
    delete : {
        onSuccess(){
            instruction.value = ''
            employeeResource.fetch()
        },
        onError(e){
            console.log(e)
        }
    }
})

function remove(ei_name){
    employeeInstructionId.value = ei_name
    showRemove.value = true; 
}

function add(){
    employeeInstructionListResource.insert.submit({
        parenttype : "Project Allocation and Instrucions",
        parentfield : "allocation",
        parent : projectInstructionId.value,
        employee : allocationEmployee.value,
        instructions : instruction.value
    })
}

</script>