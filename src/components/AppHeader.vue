<script setup>
import { useAuthModalStore } from '@/stores/AuthModalStore'
import { useUserAuthStore } from '@/stores/UserAuth'
import { signOut, getAuth } from 'firebase/auth'
import { useRoute } from 'vue-router'
import router from '@/router'

// TODO: че не работает при ...
const authModal = useAuthModalStore()
const toggleModal = () => {
  authModal.isOpen = !authModal.isOpen
}
const route = useRoute()

function logout() {
  signOut(getAuth())
  useUserAuthStore().isLoggedIn = false
  if (route.name === 'manage') {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Music
      </router-link>
      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <div class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <router-link class="px-2 text-white" href="#" :to="{ name: 'about' }">About</router-link>
          <template v-if="useUserAuthStore().isAuthRequested">
            <a
              v-if="!useUserAuthStore().isLoggedIn"
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleModal"
              >Login / Register
            </a>
            <div v-else>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
              <a class="px-2 text-white" href="#" @click="logout">Logout</a>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
