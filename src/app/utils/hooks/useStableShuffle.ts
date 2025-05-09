import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { useMemo } from "react"

/**
 * Shuffles a list of items.
 *
 * If a seed is provided, the randomization will be stable across renders.
 *
 * If no seed is provided, a daily seed will be generated, so that the shuffled results are stable
 * for an entire day.
 */
export const useStableShuffle = <T>({ items, seed }: { items: T[]; seed?: string }) => {
  const randomSeed = seed ?? dailySeed()
  const { shuffle } = useMemo(() => seededShuffle(randomSeed), [randomSeed])
  const shuffled = useMemo(() => shuffle(items), [shuffle, items])

  return { shuffled, seed: randomSeed }
}

/**
 * Each subsequent call to the return function of xmur3 produces a new "random"
 * 32-bit hash value to be used as a seed in a PRNG.
 * https://github.com/bryc/code/blob/master/jshash/PRNGs.md#addendum-a-seed-generating-functions
 */
const xmur3 = (str: string) => {
  let h = 1779033703 ^ str.length

  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }

  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}

/**
 * https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32
 */
const mulberry32 = (a: number) => {
  return () => {
    let t = (a += 0x6d2b79f5)

    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Returns a Fisher-Yates shuffle function seeded with seed value
 * https://stackoverflow.com/a/53758827/160937
 */
const seededShuffle = (seed: string) => {
  const hash = xmur3(seed)
  const random = mulberry32(hash())

  const shuffle = <T>(xs: T[]) => {
    const array = xs.slice()

    let m = array.length,
      t: T,
      i: number

    while (m) {
      i = Math.floor(random() * m--)
      t = array[m]
      array[m] = array[i]
      array[i] = t
    }

    return array
  }

  return { shuffle }
}

const dailySeed = () => {
  const timeZone = LegacyNativeModules.ARCocoaConstantsModule?.LocalTimeZone || "UTC"
  let dateString = ""

  try {
    dateString = new Date(Date.now()).toLocaleString("en-GB", { timeZone })
  } catch (error) {
    if ((error as Error).name === "RangeError") {
      // invalid time zone; fall back to UTC
      dateString = new Date(Date.now()).toLocaleString("en-GB", { timeZone: "UTC" })
    } else {
      throw error
    }
  }

  return dateString.slice(0, 10)
}
