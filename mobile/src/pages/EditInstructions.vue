<template>
    <div class=" pt-5 pb-5 pl-3 pr-3">
        <div class="bg-[#B9C8EA] pt-2 pb-3 text-center rounded-t-lg">
            <p class="text-[#4A6BB6] font-[600]">{{ route.params.project_name }}</p>
        </div>
        <div class="border-x-2 border-b-2 border-[#B9C8EA] bg-[#F5F8FF] pt-3 pb-3 pl-3 pr-3 rounded-b-lg">
            <div>
                <div class="bg-[#D6E1F9] w-[200px]  pt-2 pb-3 pl-5 font-[400]">
                    Instructions
                </div>
                <div>
                    <textarea class="border-0 w-full h-48" v-model="projectInstruction"></textarea>
                    <div class="text-center pt-4 pb-5">
                        <PrimaryButton name="Save" @click="setInstructions"
                            :loading="projectAllocationInstructionResource.setValue.loading"></PrimaryButton>
                    </div>
                </div>
            </div>
            <div>
                <div class="bg-[#D6E1F9] w-[200px]  pt-2 pb-3 pl-5 font-[400]">
                    Specific Instructions
                </div>
                <div>
                    <div class="flex items-center gap-3 bg-white pt-4 pb-2 pl-4">
                        <p>Select Employee</p>
                        <select v-model="employeeInstructionId" @click="updateInstructions" class="w-40">
                            <option :value="e.name" v-for="e in employeeInstructionListResource.data">{{ e.employee_name
                                }}
                            </option>
                        </select>
                    </div>
                    <div v-if="employeeInstructionId">
                        <textarea class="border-0 w-full h-48" v-model="employeeInstruction"></textarea>
                        <div class="text-center pt-4 pb-5">
                            <PrimaryButton name="Save" @click="setEmployeeInstruction"
                                :loading="employeeInstructionListResource.setValue.loading"></PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import PrimaryButton from "../components/PrimaryButton.vue";
import { ref } from 'vue';
import { createListResource, toast } from "frappe-ui";

const route = useRoute()

const projectInstruction = ref('')
const projectInstructionId = ref('')

const employeeInstruction = ref('')
const employeeInstructionId = ref('')

const employeeInstructionListResource = createListResource({
    doctype: "Employee Allocation Instruction",
    parent: "Project Allocation and Instrucions",
    filters: { parent: projectInstructionId },
    fields: ["employee_name", "name", "instructions"],
    setValue: {
        onSuccess() {
            employeeInstructionListResource.fetch()
            toast({
                title: "Success",
                text: "Updated",
                icon: "check-circle",
                position: "bottom-right",
                iconClasses: "text-blue-500",
            });
        }
    }
})

const projectAllocationInstructionResource = createListResource({
    doctype: "Project Allocation and Instrucions",
    filters: { "project_name": route.params.project_name },
    fields: ["work_instruction", "name"],
    auto: true,
    onSuccess(d) {
        projectInstruction.value = d[0].work_instruction
        projectInstructionId.value = d[0].name
        employeeInstructionListResource.fetch()
    },
    setValue: {
        onSuccess() {
            toast({
                title: "Success",
                text: "Updated",
                icon: "check-circle",
                position: "bottom-right",
                iconClasses: "text-blue-500",
            });
        }
    }
})

function setInstructions() {
    projectAllocationInstructionResource.setValue.submit({
        name: projectInstructionId.value,
        work_instruction: projectInstruction.value
    })
}

function setEmployeeInstruction() {
    employeeInstructionListResource.setValue.submit({
        name: employeeInstructionId.value,
        instructions: employeeInstruction.value
    })
}

function updateInstructions() {
    if (employeeInstructionId.value) {
        let instructions = employeeInstructionListResource.data
            .find(d => d.name === employeeInstructionId.value)
        employeeInstruction.value = instructions.instructions
    }
}

</script>