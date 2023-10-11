import { defineStore } from 'pinia'

export const useAuthModalStore = defineStore('authModalStore', {
  state: () => ({
    isOpen: false
  }),
  getters: {
    hiddenClass(state) {
      return state.isOpen ? '' : 'hidden'
    }
  }
})
