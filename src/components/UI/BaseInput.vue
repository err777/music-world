<script setup>
import { Field } from 'vee-validate'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'title'
  }
})
</script>

<template>
  <div class="mb-3">
    <label class="inline-block mb-2"><slot /></label>
    <Field
      :name="name"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      placeholder="Поле для ввода"
    />
    <ErrorMessage class="text-red-600" :name="name" />
  </div>
</template>

<style scoped></style>
