import { ref } from 'vue'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

const db = getFirestore()

const useSong = () => {
  const loading = ref(false)
  const song = ref(null)
  const error = ref(false)

  const getSong = async (songId) => {
    const songRef = doc(db, 'songs', songId)
    const songSnap = await getDoc(songRef)

    if (songSnap.data()) {
      song.value = { ...songSnap.data(), id: songSnap.id }
      error.value = false
    } else {
      error.value = true
    }
  }

  return {
    loading,
    error,
    song,
    getSong
  }
}

export default useSong
