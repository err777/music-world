<script setup>
import BaseInput from '@/components/UI/BaseInput.vue'
import BaseBtn from '@/components/UI/BaseBtn.vue'
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div>
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <div class="inline-block font-bold ml-4">жанр: {{ song.genre }}</div>
      <button
        @click="deleteSong(song)"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        @click="toggleForm(song)"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="song.formIsActive">
      <form class="mt-4">
        <base-input v-model="songTitle">Название песни</base-input>
        <base-input v-model="songGenre">Жанр</base-input>
        <base-btn @click.prevent="updateSong(song)">Принять</base-btn>
        <base-btn @click="song.formIsActive = false">Назад</base-btn>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
