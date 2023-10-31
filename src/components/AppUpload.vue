<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { ref as storeRef, getStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { doc, getFirestore, addDoc, collection } from 'firebase/firestore'

const isDragover = ref(false)
const uploads = ref([])

// const uid = getAuth().currentUser.uid

let uploadIndex = null

const callbackNextOrObserver = (snapshot) => {
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  uploads.value[uploadIndex].currentProgress = progress
}

const callbackError = (error) => {
  uploads.value[uploadIndex].variant = 'bg-red-400'
  uploads.value[uploadIndex].icon = 'fas fa-times'
  uploads.value[uploadIndex].textClass = 'text-red-400'
  console.log(error)
}

const callbackComplete = async () => {
  // Handle successful uploads on complete

  const auth = getAuth()
  const user = auth.currentUser
  const song = {
    uid: user.uid,
    displayName: user.displayName,
    originalName: uploadTask.snapshot.ref.name,
    modifiedName: uploadTask.snapshot.ref.name,
    genre: '',
    commentCount: 0,
    likesCount: 0,
    formIsActive: false
  }
  //TODO: НЕ ЗАБЫТЬ!!! Референс нужно делать непосредственно внутри, а не импортировать. Референсы не реактивны. Не могут менять инстансы или дату.
  const db = getFirestore()
  song.url = await getDownloadURL(uploadTask.snapshot.ref)
  await addDoc(collection(db, 'songs'), song)
  uploads.value[uploadIndex].variant = 'bg-green-400'
  uploads.value[uploadIndex].icon = 'fas fa-check'
  uploads.value[uploadIndex].textClass = 'text-green-400'
}

const upload = ($event) => {
  //TODO: реализовать загрузку нескольких файлов одновременно
  isDragover.value = false

  const file = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0]
  console.log(file)

  if (file.type !== 'audio/mpeg') {
    console.log('file type is incorrect')
    return
  }

  const storage = getStorage()
  const songsRef = storeRef(storage, `songs/${file.name}`)
  const uploadTask = uploadBytesResumable(songsRef, file)

  uploadIndex =
    uploads.value.push({
      task: uploadTask,
      currentProgress: 0,
      name: file.name,
      variant: 'bg-blue-400',
      icon: 'fas fa-spinner fa-spin',
      textClass: ''
    }) - 1

  uploadTask.on('state_changed', callbackNextOrObserver, callbackError, callbackComplete)
}

onBeforeUnmount(() => {
  uploads.value.forEach((upload) => {
    upload.task.cancel()
  })
})
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @dragenter.prevent.stop="isDragover = true"
        @dragleave.prevent.stop="isDragover = false"
        @drop.prevent.stop="upload"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" @change="upload" />
      <hr class="my-6" />
      <!-- Progress Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.textClass">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
