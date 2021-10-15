import { unsafe_getFeatureFlag } from "lib/store/GlobalStore"
import { Platform } from "react-native"

export function createGeminiUrl({
  imageURL,
  width,
  height,
  geminiHost = "d7hftxdivxxvm.cloudfront.net",
  imageQuality = 80,
  resizeMode = "fit",
}: {
  imageURL: string
  width: number
  height: number
  geminiHost?: string
  imageQuality?: number
  resizeMode?: "fit" | "fill"
}) {
  const enableWebPImages = unsafe_getFeatureFlag("AREnableWebPImages") && Platform.OS === "android"
  return `https://${geminiHost}/?${
    enableWebPImages ? "convert_to=webp&" : ""
  }resize_to=${resizeMode}&width=${width}&height=${height}&quality=${imageQuality}&src=${encodeURIComponent(imageURL)}`
}
