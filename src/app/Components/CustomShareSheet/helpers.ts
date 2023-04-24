import { unsafe__getEnvironment } from "app/store/GlobalStore"
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
