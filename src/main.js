import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from './includes/validation'

import './includes/firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserAuthStore } from '@/stores/UserAuth'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VeeValidatePlugin)
let auth = getAuth()
onAuthStateChanged(auth, (user) => {
  if (user) {
    useUserAuthStore().isLoggedIn = true
  }
  if (!useUserAuthStore().isAuthRequested) {
    app.mount('#app')
  }
  useUserAuthStore().isAuthRequested = true
})
