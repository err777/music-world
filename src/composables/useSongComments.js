import { computed, ref } from 'vue'
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where
} from 'firebase/firestore'

const db = getFirestore()

const useSongComments = () => {
  const loading = ref(false)
  const commentInSubmission = ref(false)
  const comments = ref([])
  const selectedSort = ref('1')

  const sortedComments = computed(() => {
    return comments.value.toSorted((a, b) => {
      if (selectedSort.value === '1') {
        return new Date(b.datePosted) - new Date(a.datePosted)
      }
      return new Date(a.datePosted) - new Date(b.datePosted)
    })
  })

  const getComments = async (songId) => {
    const colRef = collection(db, 'comments')
    const q = query(colRef, where('sid', '==', songId))

    await onSnapshot(q, (snapshot) => {
      comments.value = []
      snapshot.docs.forEach((doc) => {
        comments.value.push({ ...doc.data(), id: doc.id })
      })
    })
  }

  const incrementCommentsCount = async (songId) => {
    const songRef = doc(db, 'songs', songId)
    await updateDoc(songRef, {
      commentCount: increment(1)
    })
  }

  const addComment = async (songId, text, currentUser) => {
    commentInSubmission.value = true

    const comment = {
      content: text,
      datePosted: new Date().toString(),
      sid: songId,
      name: currentUser.displayName,
      uid: currentUser.uid
    }
    await addDoc(collection(db, 'comments'), comment)
    await incrementCommentsCount()

    commentInSubmission.value = false
  }

  return {
    loading,
    commentInSubmission,
    comments,
    selectedSort,
    sortedComments,
    getComments,
    addComment
  }
}

export default useSongComments
