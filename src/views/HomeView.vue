<script setup>
import MusicItem from '@/components/MusicItem.vue'
import { onMounted, ref } from 'vue'
import { doc, updateDoc, increment, getFirestore } from 'firebase/firestore'
import useSongs from '@/composables/useSongs'

const playlistEnd = ref('')
const db = getFirestore()

const { songs, getSongs, selectedSort, sortOptions, searchedAndSortedSongs, searchQuery } =
  useSongs()

getSongs()

const addLikes = async (song) => {
  const itemRef = doc(db, 'songs', song.id)
  await updateDoc(itemRef, {
    likesCount: increment(1)
  })
  const targetSong = songs.value.find((el) => el.id === song.id)
  targetSong.likesCount += 1
}

onMounted(() => {
  let options = {
    rootMargin: '0px',
    threshold: 1.0
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      getSongs()
    }
  }, options)
  observer.observe(playlistEnd.value)
})
</script>

<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(src/assets/img/header.png)"
      />
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/src/assets/img/introduction-music.png"
        alt="img"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="flex px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <input
            v-model="searchQuery"
            placeholder="Начните вводить название..."
            class="w-full py-1 px-2 text-black outline-none placeholder-gray-700 focus:placeholder-gray-400"
          />
          <select v-model="selectedSort" class="text-sm text-center outline-none cursor-pointer">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <ol id="playlist">
          <music-item
            v-for="song in searchedAndSortedSongs"
            :key="song.id"
            :song="song"
            @addLike="addLikes(song)"
          />
        </ol>
        <div ref="playlistEnd" />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
