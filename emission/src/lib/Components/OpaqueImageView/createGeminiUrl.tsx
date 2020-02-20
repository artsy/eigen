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
  return `https://${geminiHost}/?resize_to=${resizeMode}&width=${width}&height=${height}&quality=${imageQuality}&src=${encodeURIComponent(
    imageURL
  )}`
}
