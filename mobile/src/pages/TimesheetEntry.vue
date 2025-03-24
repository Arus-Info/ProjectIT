<template>
    <div v-if="uploading" class="flex h-80 items-center justify-center">
        <Spinner class=" h-12"></Spinner>
    </div>
    <div v-else>
        <div class=" pt-7 text-right pr-7" v-if="!showCamera">
            <PrimaryButton @click="showCamera = true" :disabled="projectName == ''" :name="actionName"></PrimaryButton>
        </div>
        <div v-if="!showCamera">
            <div v-if="actionName == 'Check-In'">
                <div class=" pt-7 pl-6 pr-6 font-[Inter] font-[600]">
                    <SelectionList :dataList="projectAllocationResource" @select-event="handleProjectSelection($event)"
                        :noData="isProjectAllocated">
                    </SelectionList>
                </div>
            </div>
            <div v-else class=" pl-6 pr-6 pt-7 pb-4">
                <div class="bg-[#B9C8EA] pt-3 pb-3 pl-4 pr-3 rounded-t-md flex gap-3">
                    <ProjectOutline class=" h-6 w-6"></ProjectOutline>
                    <p class="text-[#4A6BB6] font-[600] font-[Inter]"> {{ projectName }}</p>
                </div>
                <div
                    class="bg-[#F5F8FF] pl-4 pr-3 pt-5 pb-3 rounded-b-md border-[#B9C8EA] border-x-2 border-b-2 flex flex-col gap-3">
                    <p> Check-In Time : {{ dayjs(timesheetDetails.from_time).format("hh:mm:ss a") }}</p>
                    <div @click="showCaption = true"
                        class="bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-sm pt-3 pb-3 pl-2 pr-2 flex gap-2">
                        <FeatherIcon name="download" class="h-6 w-6" />
                        <p>Additional Photo without Checkout</p>
                    </div>
                    <div v-if="showCaption" class="text-center flex flex-col gap-3">
                        <textarea v-model="caption"></textarea>
                        <div>
                            <PrimaryButton @click="showCamera = true; cameraMode = 'Upload'" name="Upload">
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
            <div class=" pl-6 pr-6 pt-7 pb-4" v-if="projectName != ''">
                <Instructions :instructions="instructions"></Instructions>
                <div class="pt-5">
                    <TeamMembers :members="members"></TeamMembers>
                </div>
            </div>
        </div>
        <!-- <div v-if="showCamera" class=" pt-7">
            <Camera :mode="cameraMode" @capture-event="handleImageCapture($event)" @close-event="showCamera = false">
            </Camera>
        </div> -->
    </div>

    <div v-if="showError">
        <ErrorMessage @dialog-event="showError = $event" :error-message="errorMessage"></ErrorMessage>
    </div>
</template>
<script setup>
import { inject, ref, onMounted, watch } from 'vue';
import { createResource, createListResource, toast, FeatherIcon, Spinner } from 'frappe-ui';
import { FileAttachment } from '../composables';
import ErrorMessage from '../components/ErrorMessage.vue';
import SelectionList from '../components/SelectionList.vue';
import Camera from '../components/Camera.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import dayjs from 'dayjs';
import ProjectOutline from './icons/ProjectOutline.vue'
import customParseFormat from "dayjs/plugin/customParseFormat";
import Instructions from './Instructions.vue';
import { get_instructions } from '../data/work_instructions';
import TeamMembers from './TeamMembers.vue';
import { showCamera, cameraMode, imageFile } from '../data/camera_context';

watch(imageFile,() =>{
    handleImageCapture(imageFile.value)
}
)
dayjs.extend(customParseFormat);

onMounted(async function () {
    timesheet.update({
        fields: ["name", "time_logs.from_time", "time_logs.project", "note", "parent_project.project_name"],
        filters: {
            employee: employee.name,
            docstatus: 0,
            start_date: dayjs().format('YYYY-MM-DD')
        },
    })
    timesheet.fetch()
    await projectAllocationResource.fetch()
    if (projectAllocationResource.data.length === 0) {
        isProjectAllocated.value = false
    }
})

const employee = inject("employee_id")
const projectName = ref('')
const timesheetDetails = ref({})
const customer = ref('')
const projectId = ref('')
const actionName = ref('Check-In')
cameraMode.value = 'Check-In'

const isProjectAllocated = ref(true)
const checkInImage = ref([])

const errorMessage = ref('')
const showError = ref(false)

const showCaption = ref(false)
const caption = ref('')

const instructions = ref({})
const members = ref({})

const timesheetEntry = ref({})

const uploading = ref(false)

const employeeCheckInResource = createListResource({
    doctype: "Employee Checkin",
    insert: {
        onSuccess() {
            toast({
                title: "Success",
                text: actionName.value === "Check-Out" ? "Checked-In" : "Checked-Out",
                icon: "check-circle",
                position: "bottom-center",
                iconClasses: "text-blue-500",
            });
            uploading.value = false
        }
    }
})

async function get_current_location() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                insertCheckIns(position.coords.latitude, position.coords.longitude)
            },
            (error) => {
                errorMessage.value = error.message
                showError.value = true
                uploading.value = false
            }
        )
    }
    else {
        errorMessage.value = "Geolocation is not supported by your device"
        showError.value = true
        uploading.value = false
    }
}

async function insertCheckIns(latitude, longitude) {
    let time = actionName.value === "Check-Out" ? timesheetEntry.value.time_logs[0].from_time : timesheetEntry.value.time_logs[0].to_time
    employeeCheckInResource.insert.submit({
        employee: employee.name,
        time: time,
        log_type: actionName.value === "Check-Out" ? "IN" : "OUT",
        custom_timesheet: timesheetEntry.value.name,
        latitude: latitude,
        longitude: longitude
    })
}

const timesheet = createListResource({
    doctype: "Timesheet",
    insert: {
        onSuccess(data) {
            timesheetEntry.value = data
            actionName.value = "Check-Out"
            cameraMode.value = "Check-Out"
            uploadAllAttachments("Timesheet", data.name, checkInImage.value)
            get_current_location()
        },
        onError(e) {
            errorMessage.value = e
            showError.value = true
        }
    },
    setValue: {
        onSuccess(data) {
            if (cameraMode.value === 'Upload') {
                uploading.value = false
                cameraMode.value = 'Check-Out'
                caption.value = ''
                toast({
                    title: "Success",
                    text: "Additional Photo Uploaded",
                    icon: "check-circle",
                    position: "bottom-center",
                    iconClasses: "text-blue-500",
                });
                timesheet.fetch()
            }
            else {
                timesheetEntry.value = data
                get_current_location()
                cameraMode.value = "Check-In"
                actionName.value = "Check-In"
                projectName.value = ''
            }
        },
        onError(e) {
            errorMessage.value = e
            showError.value = true
        }
    },
    onSuccess(data) {
        if (data.length) {
            actionName.value = "Check-Out"
            cameraMode.value = "Check-Out"
            timesheetDetails.value = data[0]
            projectName.value = data[0].project_name
            projectId.value = data[0].project
            displayInstructions()
            teamMembers.fetch()
        }
    },
    onError(e) {
        errorMessage.value = e
        showError.value = true
    }

})

const projectAllocationResource = createResource({
    url: "projectit.api.get_project_allocation",
    makeParams() {
        return {
            employee_id: employee.name
        }
    }
})

function displayInstructions() {
    let promise = get_instructions(dayjs().format("YYYY-MM-DD"), projectName.value, employee.name)
    promise
        .then((d) => {
            instructions.value = d
        })
}

const teamMembers = createResource({
    url: "projectit.api.get_team_members",
    makeParams() {
        return {
            project_name: projectName.value
        }
    },
    transform(data) {
        for (let d of data) {
            d.members = JSON.parse(d.members)
        }
        return data
    },
    onSuccess(d) {
        members.value = d[0].members
    }
})

const projectResource = createListResource({
    doctype: "Project",
    fields: ["customer", "name"],
    onSuccess(d) {
        customer.value = d[0].customer
        projectId.value = d[0].name
    },
    onError(e) {
        errorMessage.value = e
        showError.value = true
    }
})

function handleProjectSelection(project_name) {
    projectName.value = project_name
    displayInstructions()
    teamMembers.fetch()
    projectResource.update({
        filters: { "project_name": project_name },
    })
    projectResource.fetch()
}

async function uploadAllAttachments(documentType, documentName, attachments) {
    const uploadPromises = attachments.map(async (attachment) => {
        const fileAttachment = new FileAttachment(attachment)
        return fileAttachment
            .upload(documentType, documentName, "")
            .then((fileDoc) => {
                fileDoc.uploaded = true
            })

    })

    await Promise.allSettled(uploadPromises)
}

async function handleImageCapture(file) {
    uploading.value = true
    if (cameraMode.value === 'Check-In') {
        checkInImage.value = [imageFile.value]
        checkIn()
    }
    else {
        await uploadAllAttachments("Timesheet", timesheetDetails.value.name, [imageFile.value])
        if (cameraMode.value === "Upload") {
            additionalImage()

        }
        else {
            checkOut()
        }
    }
}

const workTimings = createResource({
    url: "projectit.api.get_work_time_settings",
})

function checkIn() {
    timesheet.insert.submit({
        customer: customer.value,
        parent_project: projectId.value,
        employee: employee.name,
        note: "<p>Check in at " + dayjs().format("hh:mm:ss A") + "</p>",
        time_logs: [{
            from_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        }],
    })
}

function additionalImage() {
    timesheet.setValue.submit({
        name: timesheetDetails.value.name,
        note: timesheetDetails.value.note + "<p>Additional Photo added at " + dayjs().format("hh:mm:ss A") + " with caption " + caption.value + "</p>"
    })
}

async function checkOut() {
    await workTimings.fetch()
    let time_logs = []
    let start_time = dayjs(workTimings.data.start_time, 'HH:mm:ss')
    let end_time = dayjs(workTimings.data.end_time, 'HH:mm:ss')
    let from_time = dayjs(timesheetDetails.value.from_time)
    let time = dayjs()

    if (from_time < start_time && time >= start_time) {
        time_logs.push({
            activity_type: workTimings.data.over_time_activity_type,
            from_time: from_time.format('YYYY-MM-DD HH:mm:ss'),
            to_time: start_time.format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        })
        from_time = start_time.add(1, 's')
    }
    if (time >= end_time && from_time < end_time) {
        time_logs.push({
            activity_type: workTimings.data.regular_time_activity_type,
            from_time: from_time.format('YYYY-MM-DD HH:mm:ss'),
            to_time: end_time.format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        })
        from_time = end_time.add(1, 's')
    }
    if ((time > end_time && from_time >= end_time) || time <= start_time) {
        time_logs.push({
            activity_type: workTimings.data.over_time_activity_type,
            from_time: from_time.format('YYYY-MM-DD HH:mm:ss'),
            to_time: time.format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        })
    }
    if (time <= end_time && from_time >= start_time) {
        time_logs.push({
            activity_type: workTimings.data.regular_time_activity_type,
            from_time: from_time.format('YYYY-MM-DD HH:mm:ss'),
            to_time: time.format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        })
    }
    instructions.value = []
    members.value = []
    timesheet.setValue.submit({
        name: timesheetDetails.value.name,
        note: timesheetDetails.value.note + "<p> Check Out at " + dayjs().format("hh:mm:ss A") + "</p>",
        time_logs: time_logs,
        docstatus: 1
    })
}
</script>