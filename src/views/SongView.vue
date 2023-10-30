<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SongComment from '@/components/SongComment.vue'
import {
  doc,
  getDoc,
  getFirestore,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import router from '@/router'
import { Field, Form } from 'vee-validate'
import { getAuth } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { useUserAuthStore } from '@/stores/UserAuth'
import { useAppPlayerStore } from '@/stores/AppPlayerStore'

const db = getFirestore()

const song = ref({})
const songId = useRoute().params.id

const commentInSubmission = ref(false)
const comments = ref([])
const selectedSort = ref('1')

const { sort } = useRoute().query
selectedSort.value = sort === '1' || sort === '2' ? sort : '1'
watch(selectedSort, (value) => {
  if (value === sort) {
    return
  }
  router.push({
    query: {
      sort: value
    }
  })
})

const commentSchema = {
  comment: 'required|min:3|max:300'
}
const getSong = async () => {
  const songRef = doc(db, 'songs', songId)
  const songSnap = await getDoc(songRef)
  if (!songSnap.exists) {
    router.push({ name: 'home' })
    return
  }
  song.value = { ...songSnap.data(), id: songSnap.id }
}
getSong()

const auth = getAuth()
const addComment = async (values, { resetForm }) => {
  commentInSubmission.value = true
  const comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    sid: songId,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid
  }
  await addDoc(collection(db, 'comments'), comment)
  await incrementCommentsCount()
  commentInSubmission.value = false
  resetForm()
}
const incrementCommentsCount = async () => {
  const songRef = doc(db, 'songs', song.value.id)
  await updateDoc(songRef, {
    commentCount: increment(1)
  })
}
async function getComments() {
  const colRef = collection(db, 'comments')
  const q = query(colRef, where('sid', '==', songId))

  await onSnapshot(q, (snapshot) => {
    comments.value = []
    snapshot.docs.forEach((doc) => {
      comments.value.push({ ...doc.data(), id: doc.id })
    })
  })
}
getComments()

const sortedComments = computed(() => {
  return comments.value.toSorted((a, b) => {
    if (selectedSort.value === '1') {
      return new Date(b.datePosted) - new Date(a.datePosted)
    }
    return new Date(a.datePosted) - new Date(b.datePosted)
  })
})
</script>

<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/src/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="useAppPlayerStore().newSong(song)"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ comments.length }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <Form
            v-if="useUserAuthStore().isLoggedIn"
            :validation-schema="commentSchema"
            @submit="addComment"
          >
            <Field
              as="textarea"
              name="comment"
              type="input"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            />
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              :disabled="commentInSubmission"
              :class="
                !commentInSubmission
                  ? 'py-1.5 px-3 rounded text-white bg-green-600 block'
                  : 'py-1.5 px-3 rounded text-white bg-blue-600 block'
              "
            >
              Submit
            </button>
          </Form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="selectedSort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <song-comment v-for="comment in sortedComments" :key="comment.id" :comment="comment" />
    </ul>
  </main>
</template>
