<script setup>
import AppUpload from '@/components/AppUpload.vue'
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore'

import { getAuth } from 'firebase/auth'
import CompositionItem from '@/components/CompositionItem.vue'
import { ref } from 'vue'

//TODO: допилить, понять, как обновлять базу при добавлении и удалении. Прикрутить ооткрытие формы и работу с инпутами

const songs = ref([])

const uid = getAuth().currentUser.uid

const db = getFirestore()
//Получаем референс документа с заданным именем
const colRef = collection(db, 'songs')
//Получаем отфильтвованную БД. query
const q = query(colRef, where('uid', '==', uid))

// Real-time database realisation ставим обсервер, на каждое изменение снапшота, мы перерендериваем базу и ее отображение
onSnapshot(q, (snapshot) => {
  songs.value = []
  snapshot.docs.forEach((doc) => {
    songs.value.push({ ...doc.data(), id: doc.id })
  })
})
</script>

<template>
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
            <composition-item
              :song="song"
              v-for="song in songs"
              :key="song.id"
              @closeForm="song.formIsActive = false"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
