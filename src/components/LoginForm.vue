<script setup>
import { Field, Form } from 'vee-validate'
import BaseFormItem from '@/components/BaseFormItem.vue'
import SubmitBtn from '@/components/UI/SubmitBtn.vue'
import { useUserAuthStore } from '@/stores/UserAuth'
import { useAuthModalStore } from '@/stores/AuthModalStore'
import router from '@/router'

const props = defineProps(['tab'])

const items = [
  {
    label: 'Почта',
    name: 'email',
    type: 'text',
    placeholder: 'Введите почту'
  },
  {
    label: 'Пароль',
    name: 'password',
    type: 'password',
    placeholder: 'Введите пароль'
  }
]

const loginSchema = {
  email: 'required|max:30|email',
  password: 'required|min:7|max:20'
}

async function loginUser(values) {
  try {
    await useUserAuthStore().login(values)
  } catch (error) {
    return
  }
  useUserAuthStore().isLoggedIn = true
  useAuthModalStore().isOpen = false
  await router.push('/manage')
}
</script>

<template>
  <Form :validation-schema="loginSchema" v-slot="{ meta }" @submit="loginUser">
    <!-- Email -->
    <base-form-item v-for="item in items" :key="item.label" :item="item" />
    <submit-btn :meta="meta" :tab="tab" />
  </Form>
</template>

<style scoped></style>
