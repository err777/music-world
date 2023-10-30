import { computed, ref } from 'vue'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where
} from 'firebase/firestore'

const db = getFirestore()

const useSongs = () => {
  const loading = ref(false)
  const songs = ref([])

  // filters
  const perPage = ref(3)
  const selectedSort = ref('1')
  const sortOptions = [
    { value: '1', text: 'Сортировка по лайкам' },
    { value: '2', text: 'Сортировка по комментариям' },
    { value: '3', text: 'Сортировка по названию песни' },
    { value: '4', text: 'Сортировка по жанру' }
  ]
  const searchQuery = ref('')

  const sortedSongs = computed(() => {
    return songs.value.toSorted((a, b) => {
      switch (selectedSort.value) {
        default:
          return b.likesCount - a.likesCount
        case '2':
          return b.commentCount - a.commentCount
        case '3':
          return b.modifiedName - a.modifiedName
        case '4':
          return b.genre - a.genre
      }
    })
  })

  const searchedAndSortedSongs = computed(() => {
    return sortedSongs.value.filter((song) =>
      song.modifiedName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const getSongs = async () => {
    if (loading.value) {
      return
    }
    loading.value = true

    const docRef = collection(db, 'songs')
    let q

    if (songs.value.length) {
      const lastDocId = songs.value[songs.value.length - 1].id
      const lastDocRef = doc(db, 'songs', lastDocId)
      const lastDoc = await getDoc(lastDocRef)

      q = query(docRef, orderBy('modifiedName'), startAfter(lastDoc), limit(perPage.value))
      // console.log(lastDoc.id)
    } else {
      q = query(docRef, orderBy('modifiedName'), limit(perPage.value))
    }

    const docSnap = await getDocs(q)
    docSnap.docs.forEach((doc) => {
      songs.value.push({ ...doc.data(), id: doc.id })
    })

    loading.value = false
  }

  const getSongsRealTime = (uid) => {
    //TODO: допилить, понять, как обновлять базу при добавлении и удалении. Прикрутить ооткрытие формы и работу с инпутами

    //Получаем референс документа с заданным именем
    const colRef = collection(db, 'songs')
    //Получаем отфильтвованную БД. query
    const q = query(colRef, where('uid', '==', uid))

    // Real-time database realisation ставим обсервер, на каждое изменение снапшота, мы перерендериваем базу и ее отображение
    onSnapshot(q, (snapshot) => {
      songs.value = []
      snapshot.docs.forEach((doc) => {
        songs.value.push({ ...doc.data(), id: doc.id })
      })
    })
  }

  return {
    loading,
    songs,
    selectedSort,
    sortOptions,
    searchedAndSortedSongs,
    searchQuery,
    getSongs,
    getSongsRealTime
  }
}

export default useSongs
