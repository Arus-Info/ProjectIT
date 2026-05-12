<template>
  <Dialog
    v-model="showError"
    :options="{
      title: 'Alert',
      message: props.errorMessage,
      size: 'xl',
      actions: [
        {
          label: 'Close',
          variant: 'solid',
          onClick: () => {
            showError = false
          },
        },
      ],
    }"
  />
</template>
<script setup>
import { ref, watch } from 'vue'
import { Dialog } from 'frappe-ui'

const props = defineProps({
  errorMessage: String,
})

const emit = defineEmits(['dialog-event'])

const showError = ref(true)

watch(showError, () => {
  emit('dialog-event', false)
})
</script>
