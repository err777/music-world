<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SongComment from '@/components/SongComment.vue'
import router from '@/router'
import { Field, Form } from 'vee-validate'
import { getAuth } from 'firebase/auth'
import { useUserAuthStore } from '@/stores/UserAuth'
import { useAppPlayerStore } from '@/stores/AppPlayerStore'
import useSong from '@/composables/useSong'
import useSongComments from '@/composables/useSongComments'

const { song, error: songError, getSong } = useSong()
const { comments, commentInSubmission, selectedSort, sortedComments, getComments, addComment } =
  useSongComments()

const route = useRoute()
const songId = route.params.id

const { sort } = route.query
selectedSort.value = ['1', '2'].includes(sort) ? sort : '1'
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

const handleGetSong = async () => {
  await getSong(songId)

  if (songError.value) {
    router.push({ name: 'home' })
  }
}

handleGetSong()
getComments(songId)

const auth = getAuth()

const onSubmitComment = async (values, { resetForm }) => {
  await addComment(songId, values.comment, auth.currentUser)

  resetForm()
}
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
            @submit="onSubmitComment"
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
