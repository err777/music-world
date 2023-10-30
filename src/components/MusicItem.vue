<script setup>
defineProps({
  song: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.id } }"
        class="font-bold block text-gray-600"
        >{{ song.modifiedName }}</router-link
      >
      <span class="text-gray-500 text-sm">{{ song.genre }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <span class="comments mr-3">
        <i class="fa fa-thumbs-up text-gray-600 mr-1" @click="$emit('addLike')"></i>
        {{ song.likesCount }}
      </span>
      <router-link
        :to="{ name: 'song', params: { id: song.id }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600 mr-1"></i>
          {{ song.commentCount }}
        </span>
      </router-link>
    </div>
  </li>
</template>

<style scoped></style>
