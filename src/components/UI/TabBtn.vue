<script setup>
const props = defineProps(['currentTab', 'tabs'])
</script>

<template>
  <button
    class="flex-auto text-center block rounded py-3 px-4 transition"
    :class="{ 'hover:text-white text-white bg-blue-600': currentTab === tabs }"
  >
    <slot />
  </button>
</template>

<style scoped></style>
