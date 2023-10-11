<script setup>
import AppUpload from '@/components/AppUpload.vue'
import {
  collection,
  getFirestore,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where
} from 'firebase/firestore'
import { onBeforeMount, ref } from 'vue'
import BaseInput from '@/components/UI/BaseInput.vue'
import BaseBtn from '@/components/UI/BaseBtn.vue'
import { getAuth } from 'firebase/auth'
import CompositionItem from '@/components/CompositionItem.vue'

//TODO: допилить, понять, как обновлять базу при добавлении и удалении. Прикрутить ооткрытие формы и работу с инпутами

const uid = getAuth().currentUser.uid

const songs = ref([])
const db = getFirestore()
//Получаем референс документа с заданным именем
const colRef = collection(db, 'songs')
//Получаем отфильтвованную БД. query
const q = query(colRef, where('uid', '==', uid))

//Забираеем данные из firestore и помещаем их в массив
// getDocs(collection(db, uid))
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       songs.value.push({ ...doc.data(), id: doc.id })
//     })
//     console.log(songs.value)
//   })
//   .catch((err) => {
//     console.log(err.message)
//   })
//
//
//   const q = query(colRef, where('uid', '==', uid))
//   const qSnapshot = await getDocs(q)
//   qSnapshot.forEach((doc) => {
//     const song1 = {
//       ...doc.data(),
//       docId: doc.id
//     }
//     songs.value.push(song1)
//   })
// })

// Real-time database realisation ставим обсервер, на каждое изменение снапшота, мы перерендериваем базу и ее отображение
onSnapshot(q, (snapshot) => {
  songs.value = []
  snapshot.docs.forEach((doc) => {
    songs.value.push({ ...doc.data(), id: doc.id })
  })
  console.log(songs.value)
})

const deleteSong = (song) => {
  deleteDoc(doc(db, 'songs', song.id))
}

const songTitle = ref('')
const songGenre = ref('')
const updateSong = (song) => {
  updateDoc(doc(db, 'songs', song.id), {
    modifiedName: songTitle.value,
    genre: songGenre.value
  })
}
const toggleForm = (song) => {
  song.formIsActive = !song.formIsActive
}
</script>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Ваши треки</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Track list -->
            <composition-item v-for="song in songs" :key="song.id" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
