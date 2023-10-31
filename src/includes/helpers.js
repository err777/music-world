export function formatTime(time) {
  const minutes = Math.floor(time / 60 || 0)
  const seconds = Math.round(time - minutes * 60 || 0)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export function formatCommentDate(ms) {
  let mins = Math.floor(ms / 1000 / 60)
  let hrs = Math.floor(ms / 1000 / 60 / 60)
  let days = Math.floor(ms / 1000 / 60 / 60 / 24)
  mins = Math.floor(mins - 60 * hrs)
  hrs = Math.floor(hrs - 24 * days)

  if (ms < 60 * 1000) {
    return 'Только что'
  } else if (ms > 60 * 1000 && ms < 60 * 60 * 1000) {
    return mins + ' мин. назад'
  } else if (ms > 60 * 60 * 1000 && ms < 24 * 60 * 60 * 1000) {
    return hrs + ' ч. ' + mins + ' мин. назад'
  } else return days + ' д ' + hrs + ' ч. ' + mins + ' мин. назад'
}
