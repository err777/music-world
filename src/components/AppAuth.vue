<script setup>
import { useAuthModalStore } from '@/stores/AuthModalStore'
import { onMounted, ref } from 'vue'
import RegistrationFrom from '@/components/RegistrationFrom.vue'
import LoginForm from '@/components/LoginForm.vue'
import TabBtn from '@/components/UI/TabBtn.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserAuthStore } from '@/stores/UserAuth'

const authModal = useAuthModalStore()
const currentTab = ref('register')
const tabs = {
  login: 'login',
  register: 'register'
}
const changeTab = () => {
  currentTab.value = 'login'
}
const changeTab1 = () => {
  currentTab.value = 'register'
}
// let auth
// onMounted(() => {
//   auth = getAuth()
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       useUserAuthStore().isLoggedIn = true
//     } else {
//       useUserAuthStore().isLoggedIn = false
//     }
//   })
// })
</script>

<template>
  <div :class="authModal.hiddenClass" class="fixed z-10 inset-0 overflow-y-auto" id="modal">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Ваш аккаунт</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click="authModal.isOpen = false">
              <i class="fas fa-times"></i>
            </div>
          </div>
          <!-- Tabs -->
          <div class="flex flex-wrap mb-4">
            <tab-btn :currentTab="currentTab" :tabs="tabs.login" @click="changeTab">Войти</tab-btn>
            <tab-btn :currentTab="currentTab" :tabs="tabs.register" @click="changeTab1"
              >Регистрация</tab-btn
            >
          </div>
          <!-- Login Form -->
          <login-form v-if="currentTab === 'login'" :tab="currentTab" />
          <!-- Registration Form -->
          <registration-from v-else :tab="currentTab" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
