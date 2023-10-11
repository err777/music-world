<script setup>
import { Field } from 'vee-validate'
const props = defineProps(['item'])
</script>

<template>
  <div class="mb-3">
    <label class="inline-block mb-2">{{ item.label }}</label>
    <Field
      :name="item.name"
      :type="item.type"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      :placeholder="item.placeholder"
    />
    <ErrorMessage class="text-red-600" :name="item.name" />
  </div>
</template>

<style scoped></style>
