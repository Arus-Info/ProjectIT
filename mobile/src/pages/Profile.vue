<template>
    <div v-if="props.show" class="modal-overlay">
        <div class="w-3/4 bg-[#D6E1F9]">
            <div>
                <button @click="emit('close', false);">
                    <FeatherIcon name="chevron-left" class="w-10 h-10 bg-white" />
                </button>
            </div>
            <div class="flex flex-col items-center justify-around h-full">
                <div class="flex flex-col items-center gap-3">
                    <div class="circular-image-container">
                        <div v-if="cookies.get('user_image')">
                            <img :src="cookies.get('user_image')" class="circular-image"
                                :alt="cookies.get('full_name')" />
                        </div>
                        <div v-else class="flex items-center justify-center bg-gray-300 h-full w-full">
                            <p class="text-gray-700 text-[75px]">{{ cookies.get('full_name')[0] }}</p>
                        </div>
                    </div>
                    <div class="text-xl font-bold">
                        {{ cookies.get('full_name') }}
                    </div>
                    <div class="bg-white pt-3 pl-2 pr-2 pb-3 rounded-md">
                        <table>
                            <tbody>
                                <tr>
                                    <td>User Id</td>
                                    <td class="text-right font-semibold">{{ userResource.data }}</td>
                                </tr>
                                <tr>
                                    <td>Employee Id</td>
                                    <td class="text-right font-semibold"> {{ employee.name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class=" flex flex-col gap-3">
                    <Button @click="logout" :loading="session.logout.loading" variant="ghost">
                        <div class="flex gap-3 bg-[#a3b6e0] pt-2 pb-2 w-56 justify-center items-center rounded-lg">
                            <p> Logout </p>
                            <FeatherIcon name="log-out" class="w-6 h-6 text-red-800" />
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { userResource } from '../data/user'
import { inject } from 'vue'
import { FeatherIcon } from "frappe-ui";
import { session } from '../data/session'

const employee = inject('employee_id')

const props = defineProps({
    show: Boolean
})

const cookies = new URLSearchParams(document.cookie.split('; ').join('&'))

const emit = defineEmits(['close'])

async function logout() {
    await session.logout.submit()
    emit('close', false);
}

</script>
<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-end;
}

.circular-image-container {
    width: 200px;
    height: 200px;
    overflow: hidden;
    border-radius: 50%;
}

.circular-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}
</style>