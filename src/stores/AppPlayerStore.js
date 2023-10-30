import { defineStore } from 'pinia'
import { Howl } from 'howler'

export const useAppPlayerStore = defineStore('useAppPlayerStore', {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  }),
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload()
      }
      this.currentSong = song
      this.sound = new Howl({
        src: [song.url],
        html5: true
      })
      this.sound.play()
      this.sound.on('play', () => {
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        return
      }
      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    progress() {
      this.seek = this.sound.seek()
      this.duration = this.sound.duration()

      this.playerProgress = `${(this.seek / this.duration) * 100}%`

      if (this.sound.playing()) {
        requestIdleCallback(this.progress)
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return
      }
      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      const persentage = clickX / width
      const seconds = this.sound.duration() * persentage

      this.sound.seek(seconds)
      this.sound.once('seek', this.progress)
    }
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }
      return false
    }
  }
})
