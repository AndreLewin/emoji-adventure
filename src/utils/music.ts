// avoid creating the same Audio object several times
const audios: { [key: string]: HTMLAudioElement } = {}

export const activeMusic: {
  url: string,
  audio: HTMLAudioElement | null
} = {
  url: "",
  audio: null
}

export const playMusic = (url: string) => {
  if (typeof url !== "string") {
    throw Error("Please provide a link string to a sound file. Accepted format depend on the browser. mp3 and ogg are safe bets.")
  }

  if (url === "") {
    stopMusic()
    activeMusic.audio = null
    activeMusic.url = ""
    return
  }

  if (url === activeMusic.url) {
    return
  } else {
    if (activeMusic.audio !== null) {
      stopMusic()
      activeMusic.audio = null
      activeMusic.url = ""
    }
  }

  let audio: HTMLAudioElement | null = null
  if (audios[url] !== undefined) {
    audio = audios[url]!
  } else {
    audio = new Audio(url)
    audios[url] = audio
  }
  activeMusic.url = url
  activeMusic.audio = audio
  audio.loop = true
  audio.play()
}

export const pauseMusic = () => {
  activeMusic.audio?.pause()
}

export const resumeMusic = () => {
  activeMusic.audio?.play()
}

export const stopMusic = () => {
  if (activeMusic.audio !== null) {
    activeMusic.audio.pause()
    activeMusic.audio.currentTime = 0
  }
}
