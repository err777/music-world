<script setup>
import { computed } from 'vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})
const ms = new Date() - new Date(props.comment.datePosted)

const msToTime = computed(() => {
  let mins = Math.floor(ms / 1000 / 60)
  let hrs = Math.floor(ms / 1000 / 60 / 60)
  let days = Math.floor(ms / 1000 / 60 / 60 / 24)
  mins = Math.floor(mins - 60 * hrs)
  hrs = Math.floor(hrs - 24 * days)
  if (ms < 60 * 1000) {
    return 'Только что'
  } else if (ms > 60 * 1000 && ms < 60 * 60 * 1000) {
    return mins + ' мин. назад'
  } else if (ms > 60 * 60 * 1000 && ms < 24 * 60 * 60 * 1000) {
    return hrs + ' ч. ' + mins + ' мин. назад'
  } else return days + ' д ' + hrs + ' ч. ' + mins + ' мин. назад'
})
</script>

<template>
  <li class="p-6 bg-gray-50 border border-gray-200">
    <!-- Comment Author -->
    <div class="mb-5">
      <div class="font-bold">{{ comment.name }}</div>
      <time>{{ msToTime }}</time>
    </div>

    <p>
      {{ comment.content }}
    </p>
  </li>
</template>

<style scoped></style>
