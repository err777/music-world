<script setup>
const props = defineProps(['meta', 'tab'])
</script>

<template>
  <button
    :disabled="!meta.valid"
    :class="{
      'bg-gray-200': !meta.valid,
      'bg-purple-600 hover:bg-purple-700': meta.valid
    }"
    type="submit"
    class="mt-5 w-full text-white py-1.5 px-3 rounded transition"
  >
    {{ tab === 'register' ? 'Подтвердить' : 'Войти' }}
  </button>
</template>

<style scoped></style>
