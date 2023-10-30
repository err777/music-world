<script setup>
import MusicItem from '@/components/MusicItem.vue'
import { computed, onMounted, ref } from 'vue'
import {
  collection,
  getFirestore,
  limit,
  query,
  getDocs,
  startAfter,
  orderBy,
  getDoc,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore'

const songs = ref([])
const selectedSort = ref('1')
const playlistEnd = ref('')
const maxPerPage = ref(15)
const pendingRequest = ref(false)
const db = getFirestore()
const searchQuery = ref('')

const sortedSongs = computed(() => {
  return songs.value.toSorted((a, b) => {
    switch (selectedSort.value) {
      default:
        return b.likesCount - a.likesCount
      case '2':
        return b.commentCount - a.commentCount
      case '3':
        return b.modifiedName - a.modifiedName
      case '4':
        return b.genre - a.genre
    }
  })
})

const getSongs = async () => {
  if (pendingRequest.value) {
    return
  }
  pendingRequest.value = true

  const docRef = collection(db, 'songs')
  let q

  if (songs.value.length) {
    const lastDocId = songs.value[songs.value.length - 1].id
    const lastDocRef = doc(db, 'songs', lastDocId)
    const lastDoc = await getDoc(lastDocRef)

    q = query(docRef, orderBy('modifiedName'), startAfter(lastDoc), limit(maxPerPage.value))
    // console.log(lastDoc.id)
  } else {
    q = query(docRef, orderBy('modifiedName'), limit(maxPerPage.value))
  }

  const docSnap = await getDocs(q)
  docSnap.docs.forEach((doc) => {
    songs.value.push({ ...doc.data(), id: doc.id })
  })
  pendingRequest.value = false
}
getSongs()

const searchedAndSortedSongs = computed(() => {
  return sortedSongs.value.filter((song) =>
    song.modifiedName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

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
      ></div>
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
            <option value="1">Сортировка по лайкам</option>
            <option value="2">Сортировка по комментариям</option>
            <option value="3">Сортировка по названию песни</option>
            <option value="4">Сортировка по жанру</option>
          </select>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <music-item
            v-for="song in searchedAndSortedSongs"
            :key="song.id"
            :song="song"
            @addLike="addLikes(song)"
          />
          <div ref="playlistEnd"></div>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<style scoped></style>
