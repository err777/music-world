<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="mb-3">
    <label class="inline-block mb-2"><slot /></label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      placeholder="Поле для ввода"
    />
  </div>
</template>

<style scoped></style>
