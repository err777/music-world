<script setup>
import AppUpload from '@/components/AppUpload.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import useSongs from '@/composables/useSongs'
import { getAuth } from 'firebase/auth'

const uid = getAuth().currentUser.uid

const { songs, getSongsRealTime } = useSongs()

getSongsRealTime(uid)
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
              v-for="song in songs"
              :key="song.id"
              :song="song"
              @closeForm="song.formIsActive = false"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
