import { captureMessage } from "@sentry/react-native"

const imageVersionsSortedBySize = ["normalized", "larger", "large", "medium", "small"] as const

// We used to rely on there being a "normalized" version of every image, but that
// turns out not to be the case, so in those rare situations we order the image versions
// by size and pick the largest available. These large images will then be resized by
// gemini for the actual thumbnail we fetch.
export function getBestImageVersionForThumbnail(imageVersions: ReadonlyArray<string | null>) {
  for (const size of imageVersionsSortedBySize) {
    if (imageVersions.includes(size)) {
      return size
    }
  }

  if (!__DEV__) {
    captureMessage("No appropriate image size found for artwork (see breadcrumbs for artwork slug)")
  } else {
    console.warn("No appropriate image size found!")
  }

  // doesn't really matter what we return here, the gemini image url
  // will fail to load and we'll see a gray square. I haven't come across an image
  // that this will happen for, but better safe than sorry.
  return "normalized"
}

export function getSmallImageVersionForThumbnail(imageVersions: ReadonlyArray<string | null>) {
  const smallestToLargestSize = imageVersionsSortedBySize.slice().reverse()
  for (const size of smallestToLargestSize) {
    if (imageVersions.includes(size)) {
      return size
    }
  }

  if (!__DEV__) {
    captureMessage("No appropriate image size found for artwork (see breadcrumbs for artwork slug)")
  } else {
    console.warn("No appropriate image size found!")
  }

  // doesn't really matter what we return here, the gemini image url
  // will fail to load and we'll see a gray square. I haven't come across an image
  // that this will happen for, but better safe than sorry.
  return "normalized"
}
