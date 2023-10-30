<script setup>
import BaseInput from '@/components/UI/BaseInput.vue'
import BaseBtn from '@/components/UI/BaseBtn.vue'
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore'
import { ref } from 'vue'
import { Form } from 'vee-validate'

defineProps({
  song: {
    type: Object,
    required: true
  }
})

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

const db = getFirestore()
const deleteSong = (song) => {
  deleteDoc(doc(db, 'songs', song.id))
}

const songTitle = ref('')
const songGenre = ref('')
const inSubmission = ref(false)

const updateSong = async (song) => {
  await updateDoc(doc(db, 'songs', song.id), {
    modifiedName: songTitle.value,
    genre: songGenre.value
  })
}
const toggleForm = (song) => {
  song.formIsActive = !song.formIsActive
}

const schema = {
  title: 'required|min:3|max:30|',
  genre: 'required|min:3|max:30|alpha_spaces'
}
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!song.formIsActive">
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
      <Form
        :validation-schema="schema"
        :initial-values="song"
        @submit="updateSong(song)"
        class="mt-4"
      >
        <base-input :name="'title'" v-model="songTitle">Название песни</base-input>
        <base-input :name="'genre'" v-model="songGenre">Жанр</base-input>
        <base-btn :inSubmission="inSubmission" :type="'submit'">Принять</base-btn>
        <base-btn :inSubmission="inSubmission" :type="'button'" @click="$emit('closeForm')"
          >Назад</base-btn
        >
      </Form>
    </div>
  </div>
</template>

<style scoped></style>
