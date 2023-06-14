import { take } from "lodash"

// if changing this function make sure it is also changed in MP
export const Initials = (string = "", length = 3) => {
  if (!string) return null

  const letters = take(string.match(/\b[A-Z]/g), length)
  if (letters.length >= 1) return letters.join("").toUpperCase()

  return take(string.match(/\b\w/g), length).join("").toUpperCase()
}
