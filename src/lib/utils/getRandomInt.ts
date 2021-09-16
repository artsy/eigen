export const getRandomIntInclusive = (min: number, max: number) => {
  const formattedMin = Math.ceil(min)
  const formattedMax = Math.floor(max)

  return Math.floor(Math.random() * (formattedMax - formattedMin + 1) + formattedMin)
}
