export const transformBytesToSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  if (bytes < 1) {
    return "n/a"
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10)

  if (i === 0) {
    return `${bytes} ${sizes[i]})`
  }
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}
