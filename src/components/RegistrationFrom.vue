<script setup>
import { Field, Form } from 'vee-validate'
import { ref } from 'vue'
import BaseFormItem from '@/components/BaseFormItem.vue'
import SubmitBtn from '@/components/UI/SubmitBtn.vue'
import { useUserAuthStore } from '@/stores/UserAuth'
import { formFields, schema } from '@/components/RegistrationForm.data'

defineProps(['tab'])

const regShowAlert = ref(false)
const regInSubmission = ref(false)
const regAlertVariant = ref('bg-blue-500')
const regAlertMsg = ref('Пожалуйста подождите, <br>ваш аккаунт в процессе создания...')
async function registerUser(values) {
  regShowAlert.value = true
  regInSubmission.value = true
  regAlertVariant.value = 'bg-blue-500'
  regAlertMsg.value = 'Пожалуйста подождите, <br> ваш аккаунт в процессе создания...'

  try {
    await useUserAuthStore().register(values)
  } catch (error) {
    regInSubmission.value = false
    regAlertVariant.value = 'bg-red-500'
    regAlertMsg.value = error.message
    console.log(error.message)
    return
  }
  regAlertVariant.value = 'bg-green-500'
  regAlertMsg.value = 'Ваша ккаунт успешно создан!'
}
</script>

<template>
  <div
    v-html="regAlertMsg"
    v-if="regShowAlert"
    :class="regAlertVariant"
    class="text-white text-center font-bold p-4 rounded mb-4"
  ></div>
  <Form v-slot="{ meta }" :validation-schema="schema" @submit="registerUser">
    <base-form-item v-for="item in formFields" :key="item.label" :item="item" />
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <label class="inline-block">Правила пользования</label>
      <Field name="tos" value="1" type="checkbox" class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
    </div>
    <ErrorMessage class="text-red-600" name="tos" />
    <submit-btn v-show="!regInSubmission" :meta="meta" :tab="tab" />
  </Form>
</template>

<style scoped></style>
