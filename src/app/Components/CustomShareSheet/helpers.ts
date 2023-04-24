import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { take } from "lodash"
import ViewShot from "react-native-view-shot"

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

export const getBase64Data = async (viewShot: ViewShot) => {
  const base64RawData = await viewShot.capture!()
  const base64Data = `data:image/png;base64,${base64RawData}`

  return base64Data
}

export const shareContent = (artwork: {
  title: string
  href: string
  artists: Array<{
    name: string | null
  } | null> | null
}) => {
  const { title, href, artists } = artwork
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
