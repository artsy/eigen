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

// Only the field we read, which also earns a higher rate limit from Vimeo
type VimeoAPIResponse = {
  pictures: {
    sizes: Array<{
      link_with_play_button: string
    }>
  }
} | null

// A stuck request gives up after this, so the caller can fall back to the player's own poster
const VIMEO_METADATA_TIMEOUT_MS = 5000

export const useVimeoVideoMetadata = (videoId: string) => {
  const [videoMetadata, setVideoMetadata] = useState<VimeoAPIResponse>(null)
  const [hasFinished, setHasFinished] = useState(false)
  const coverImage = videoMetadata?.pictures?.sizes?.[4]?.link_with_play_button

  useEffect(() => {
    const controller = new AbortController()
    let timedOut = false
    const timeout = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, VIMEO_METADATA_TIMEOUT_MS)

    const fetchVideoMetadata = async () => {
      try {
        const response = await fetch(
          `https://api.vimeo.com/videos/${videoId}?fields=pictures.sizes.link_with_play_button`,
          {
            headers: {
              Accept: "application/vnd.vimeo.*+json;version=3.4",
              Authorization: `Bearer ${Keys.secureFor("VIMEO_PUBLIC_TOKEN")}`,
            },
            signal: controller.signal,
          }
        )
        const data = response.ok ? await response.json() : null
        setVideoMetadata(data)
        setHasFinished(true)
      } catch (error) {
        // Aborted by unmounting, so there is nothing left to update
        if (controller.signal.aborted && !timedOut) {
          return
        }

        console.log("[ImageCarouselVimeoVideo] Error:", error)
        setHasFinished(true)
      } finally {
        clearTimeout(timeout)
      }
    }

    fetchVideoMetadata()

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [videoId])

  return {
    coverImage,
    // The request ended without a usable cover: an error, a timeout or no matching size
    isCoverUnavailable: hasFinished && !coverImage,
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

/** Null for a non-YouTube url, or a YouTube one with no id (eg a channel link). */
export const getYouTubeThumbnailUrl = (urlString: string): string | null => {
  const id = extractYouTubeId(urlString)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
