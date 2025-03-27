<template>
    <button :disabled="props.disabled|| props.loading">
        <div :class='["rounded-lg pl-4 pr-4 h-10 flex items-center justify-center text-[#FFFFFF]",
            (props.disabled || props.loading) ? "bg-[#A1A3AB]" : "bg-[#4A6BB6] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"]' >
            <div v-if="props.loading">
                <Spinner class="w-6" />
            </div>
            <div class="text-white">{{ props.name }}</div>
        </div>
    </button>
</template>
<script setup>
import { Spinner } from 'frappe-ui';
const props = defineProps({
    name: String,
    disabled: Boolean,
    loading : Boolean
})
</script>