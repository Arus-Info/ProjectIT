<template>
  <InstallationPrompt />
  <div class="pl-5 pr-5 pt-36">
    <div
      class="pt-5 pl-3 pr-3 pb-5 border-2 border-[#B9C8EA] rounded-lg bg-[#F5F8FF]"
    >
      <div
        class="font-[Inter] font-[500] text-[20px] text-[#4A6BB6] pb-3 text-center"
      >
        Login to ProjectIT
      </div>

      <form class="flex flex-col space-y-2 w-full" @submit.prevent="submit">
        <Input
          required
          name="email"
          type="text"
          placeholder="johndoe@email.com"
          label="User ID"
        />
        <Input
          required
          name="password"
          type="password"
          placeholder="••••••"
          label="Password"
        />
        <Button :loading="session.login.loading" variant="solid">Login</Button>
      </form>
    </div>
  </div>
  <div v-if="showAuthenticationError">
    <ErrorMessage
      @dialog-event="showAuthenticationError = $event"
      error-message="Invalid Login"
    ></ErrorMessage>
  </div>
</template>
<script lang="ts" setup>
import { session, showAuthenticationError } from '../data/session'
import InstallationPrompt from './InstallationPrompt.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

function submit(e) {
  let formData = new FormData(e.target)
  session.login.submit({
    email: formData.get('email'),
    password: formData.get('password'),
  })
}
</script>
