<template>
  <div class="sticky top-0">
    <div
      class="bg-gradient-to-r from-[#4A6BB6] to-[#7F9DE0] h-16 flex items-center justify-between"
      v-if="companyInfo.data"
    >
      <div class="pl-4 pr-3" @click="router.push({ name: 'Home' })">
        <img :src="companyInfo.data[0]" />
      </div>
      <div class="text-[#e5e8ed] font-[700] text-[25px] font-[Inter]">
        {{ companyInfo.data[1] }}
      </div>
      <div class="pr-4">
        <div class="w-11"></div>
        <div v-if="session.isLoggedIn">
          <Avatar
            @click="showProfile = true"
            :image="cookies.get('user_image')"
            shape="circle"
            size="3xl"
            :ref_for="true"
            :label="cookies.get('full_name')"
          />
        </div>
      </div>
    </div>
    <div
      v-if="session.isLoggedIn"
      class="pt-4 pl-5 pr-5 pb-3 flex items-center justify-between bg-white"
    >
      <div>
        <button @click="router.back()">
          <img src="../images/fluent-mdl2_back.png" />
        </button>
      </div>
      <div class="text-[#4A6BB6] font-[400] text-[20px]">
        {{ moduleName }}
      </div>
      <div></div>
    </div>
  </div>
  <div v-if="showProfile">
    <Profile :show="showProfile" @close="showProfile = $event"></Profile>
  </div>
</template>
<script setup>
import { createResource, Avatar } from 'frappe-ui'
import { session } from '../data/session'
import { useRouter } from 'vue-router'
import { watch, ref } from 'vue'
import Profile from '../pages/Profile.vue'
import { moduleName } from '../data/module'

const router = useRouter()

watch(session, () => {
  cookies = new URLSearchParams(document.cookie.split('; ').join('&'))
})

let cookies = new URLSearchParams(document.cookie.split('; ').join('&'))

const showProfile = ref(false)

const companyInfo = createResource({
  url: 'projectit.api.get_header_info',
  auto: true,
})
</script>
