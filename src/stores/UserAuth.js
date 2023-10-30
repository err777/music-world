import { defineStore } from 'pinia'
import { setDoc, doc } from 'firebase/firestore'
import db from '@/includes/firebase'
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signInWithEmailAndPassword
} from 'firebase/auth'

export const useUserAuthStore = defineStore('userAuthStore', {
  state: () => ({
    isAuthRequested: false,
    isLoggedIn: false,
    songs: [] // TODO: Чому это стор?
  }),
  actions: {
    async register(values) {
      const userCred = await createUserWithEmailAndPassword(
        getAuth(),
        values.email,
        values.password
      )

      const dataObj = {
        id: userCred.user.uid,
        name: values.name,
        email: values.email,
        age: values.age
      }
      await setDoc(doc(db, 'users', userCred.user.uid), dataObj)
      await updateProfile(getAuth().currentUser, { displayName: values.name })
    },
    async login(values) {
      await signInWithEmailAndPassword(getAuth(), values.email, values.password)
    }
    // logout(state) {
    //   signOut(getAuth())
    //   state.isLoggedIn = false
    //   router.push({ name: 'home' })
    // }
  }
})
