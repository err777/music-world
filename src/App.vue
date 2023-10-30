<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppAuth from '@/components/AppAuth.vue'
import AppPlayer from '@/components/AppPlayer.vue'
</script>

<template>
  <app-header />
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"> </component>
    </transition>
  </router-view>
  <app-player />
  <app-auth />
</template>

<style scoped>
.fade-enter-form {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.2s linear;
}
.fade-leave-to {
  transition: all 0.2s linear;
  opacity: 0;
}
</style>
