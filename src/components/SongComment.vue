<script setup>
import { computed } from 'vue'
import { formatCommentDate } from '@/includes/helpers'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})
const ms = new Date() - new Date(props.comment.datePosted)

const msToTime = computed(() => formatCommentDate(ms))
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
