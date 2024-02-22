import { captureMessage } from "@sentry/react-native"
import { ShareSheetItem } from "app/Components/ShareSheet/types"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { take } from "lodash"
import ReactNativeBlobUtil from "react-native-blob-util"

export const getShareURL = (href: string) => {
  return `${unsafe__getEnvironment().webURL}${href}`
}

export const getShareMessage = (artistNames: string[], title?: string) => {
  const names = artistNames.slice(0, 3).join(", ")

  if (title) {
    return `${title} by ${names} on Artsy`
  }

  return `${names} on Artsy`
}

export const shareContent = (shareSheetItem: ShareSheetItem) => {
  const { title, href, artists } = shareSheetItem
  let computedTitle = ""

  if (artists && artists.length) {
    const names = take(artists, 3).map((artist) => artist?.name ?? "")
    computedTitle = `${title} by ${names.join(", ")} on Artsy`
  } else if (title) {
    computedTitle = `${title} on Artsy`
  }

  return {
    title: computedTitle,
    message: computedTitle,
    url: `${unsafe__getEnvironment().webURL}${href}?utm_content=artwork-share`,
  }
}

export const getShareImages = (shareSheetItem: ShareSheetItem) => {
  if (shareSheetItem.type === "sale") {
    return {
      currentImageUrl: "",
    }
  }

  if (shareSheetItem.type === "artist") {
    const currentImageUrl = (shareSheetItem.currentImageUrl ?? "").replace(":version", "normalized")

    return {
      currentImageUrl,
    }
  }

  const currentImage = (shareSheetItem?.images ?? [])[shareSheetItem?.currentImageIndex ?? 0]
  const currentImageUrl = (currentImage?.imageURL ?? "").replace(":version", "normalized")

  return {
    currentImageUrl,
  }
}

export async function getImageBase64(url: string): Promise<string> {
  try {
    const resp = await ReactNativeBlobUtil.config({
      fileCache: true,
    }).fetch("GET", url)

    const base64RawData = await resp.base64()
    const base64Data = `data:image/png;base64,${base64RawData}`

    return base64Data
  } catch (error) {
    if (__DEV__) {
      console.warn(`Failed to fetch image from ${url}: ${error}`)
    } else {
      captureMessage(`getImageBase64 Failed to fetch image from ${url}: ${error}`)
    }
    return ""
  }
}
