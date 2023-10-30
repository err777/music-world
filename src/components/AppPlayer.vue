<script setup>
import { useAppPlayerStore } from '@/stores/AppPlayerStore'
import { formatTime } from '../includes/helpers'
</script>

<template>
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div v-if="useAppPlayerStore().currentSong.modifiedName" class="text-center">
      <span class="song-title font-bold">{{ useAppPlayerStore().currentSong.modifiedName }}</span>
      by
      <span class="song-artist">{{ useAppPlayerStore().currentSong.displayName }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click="useAppPlayerStore().toggleAudio">
        <i
          class="fa text-gray-500 text-xl"
          :class="{
            'fa-play': !useAppPlayerStore().playing,
            'fa-pause': useAppPlayerStore().playing
          }"
        ></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ formatTime(useAppPlayerStore().seek) }}</div>
      <!-- Scrub Container  -->
      <div
        @click.prevent="useAppPlayerStore().updateSeek"
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
      >
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{ left: useAppPlayerStore().playerProgress }"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: useAppPlayerStore().playerProgress }"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ formatTime(useAppPlayerStore().duration) }}</div>
    </div>
  </div>
</template>

<style scoped></style>
