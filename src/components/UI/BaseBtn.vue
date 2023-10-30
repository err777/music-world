<script setup>
defineProps({
  type: {
    type: String
  },
  inSubmission: {
    type: Boolean,
    default: true
  }
})
// const isSubmit = ref(true)
</script>

<template>
  <button
    :disabled="inSubmission"
    :type="type"
    :class="{ 'bg-blue-200': inSubmission }"
    class="py-1.5 px-3 rounded text-white bg-green-600 mr-3"
  >
    <slot />
  </button>
</template>

<style scoped></style>
