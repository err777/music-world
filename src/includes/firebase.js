import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCaXyCO_de2dsQLXTdiHPycAqgEzJqEi0k',
  authDomain: 'music-world-01.firebaseapp.com',
  projectId: 'music-world-01',
  storageBucket: 'music-world-01.appspot.com',
  messagingSenderId: '80914736906',
  appId: '1:80914736906:web:5df416027612dcfd973cf3'
}

const app = initializeApp(firebaseConfig)
import { getStorage } from 'firebase/storage'

const db = getFirestore(app)
const storage = getStorage()

export default { db, storage }
