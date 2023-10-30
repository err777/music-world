import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ManageView from '@/views/ManageView.vue'
import { useUserAuthStore } from '@/stores/UserAuth'
import SongView from '@/views/SongView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkExactActiveClass: 'text-yellow-500',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/manage',
      name: 'manage',
      component: ManageView,
      meta: { requiredAuth: true }
    },
    {
      path: '/song/:id',
      name: 'song',
      component: SongView
    },
    {
      path: '/:catchAll(.*)*',
      redirect: { name: 'home' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useUserAuthStore()

  if (!to.meta.requiredAuth) {
    next()
    return
  }
  if (store.isLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})

export default router
