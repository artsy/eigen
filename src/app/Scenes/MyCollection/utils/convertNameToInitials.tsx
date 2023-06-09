import { take } from "lodash"

// if changing this function make sure it is also changed in MP
export const Initials = (string = "", length = 3) => {
  if (!string) return null

  // FIXME: Expected 1 arguments, but got 2.
  // @ts-ignore
  const letters = take(string.match(/\b[A-Z]/g, ""), length)
  if (letters.length >= 1) return letters.join("").toUpperCase()

  // FIXME: Expected 1 arguments, but got 2.
  // @ts-ignore
  return take(string.match(/\b\w/g, ""), length).join("").toUpperCase()
}
