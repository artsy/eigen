import { parse } from "query-string"
import { useEffect, useState } from "react"
import Keys from "react-native-keys"
import { URL } from "react-native-url-polyfill"

export const extractVimeoVideoDataFromUrl = (playerUrl: string) => {
  const [url, queryParams] = playerUrl.split("?")
  const videoId = url.replace("https://player.vimeo.com/video/", "")
  const params = parse("?" + queryParams)

  return {
    videoId,
    token: params.h,
    width: params.width,
    height: params.height,
  }
}

type VimeoAPIResponse = {
  pictures: {
    sizes: Array<{
      height: number
      link: string
      link_with_play_button: string
      width: number
    }>
  }
} | null

export const useVimeoVideoMetadata = (videoId: string) => {
  const [videoMetadata, setVideoMetadata] = useState<VimeoAPIResponse>(null)
  const coverImage = videoMetadata?.pictures?.sizes?.[4]?.link_with_play_button

  useEffect(() => {
    const fetchVideoMetadata = async () => {
      try {
        const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
          headers: {
            Accept: "application/vnd.vimeo.*+json;version=3.4",
            Authorization: `Bearer ${Keys.secureFor("VIMEO_PUBLIC_TOKEN")}`,
          },
        })
        const data = await response.json()
        setVideoMetadata(data)
      } catch (error) {
        console.log("[ImageCarouselVimeoVideo] Error:", error)
      }
    }

    fetchVideoMetadata()
  }, [])

  return {
    videoMetadata,
    coverImage,
  }
}

const ALLOWED_VIDEO_DOMAINS = ["player.vimeo.com", "www.youtube.com", "youtube.com", "youtu.be"]

export const isValidVideoUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString)
    return ALLOWED_VIDEO_DOMAINS.includes(url.host)
  } catch {
    return false
  }
}

export const isYouTube = (url: string) => /youtu(\.be|be\.com)/.test(url)
export const isVimeo = (url: string) => /vimeo\.com/.test(url)

export const extractYouTubeId = (urlString: string): string | null => {
  try {
    const url = new URL(urlString)
    if (url.host.includes("youtu.be")) return url.pathname.slice(1)
    if (url.searchParams.get("v")) return url.searchParams.get("v")
    const match = url.pathname.match(/\/embed\/([^/?]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
