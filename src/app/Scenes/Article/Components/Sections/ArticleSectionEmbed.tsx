import { Flex } from "@artsy/palette-mobile"
import { ArticleSectionEmbed_section$key } from "__generated__/ArticleSectionEmbed_section.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Platform } from "react-native"
import performance from "react-native-performance"
import { URL } from "react-native-url-polyfill"
import Video from "react-native-video"
import { WebView } from "react-native-webview"
import { useFragment, graphql } from "react-relay"

interface ArticleSectionEmbedProps {
  section: ArticleSectionEmbed_section$key
}

const ALLOWED_VIDEO_DOMAINS = ["player.vimeo.com", "www.youtube.com", "youtube.com"]

// TODO: Move to a util
function isValidVideoUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return ALLOWED_VIDEO_DOMAINS.includes(url.host)
  } catch {
    return false
  }
}

export const ArticleSectionEmbed: React.FC<ArticleSectionEmbedProps> = ({ section }) => {
  const useNewVideoComponent = useFeatureFlag("AREnableNewVideoView")
  const data = useFragment(
    graphql`
      fragment ArticleSectionEmbed_section on ArticleSectionEmbed {
        url
        height
        mobileHeight
      }
    `,
    section
  )

  if (!data.url) return null

  if (Platform.OS === "android" && data.url?.includes("apple.com")) {
    return null
  }

  const height = Number(data.mobileHeight || data.height || 300)

  if (isValidVideoUrl(data.url) && useNewVideoComponent) {
    console.log("[VIDEO]: Loading new video component", data.url)
    // TODO: Vimeo player urls don't work, we could detect and embed in html for this case
    // but going forward would want articles to contain the raw video links
    const replacementURL =
      "https://artsy-media-uploads.s3.amazonaws.com/Oh9jZMOOy0QHo_t0AD1VlA%2FA_Artsy_Emily+Weiner_Editorial_B-Roll_Under-30mb.mp4"

    performance.mark("video_mount")

    return (
      <Video
        repeat
        onLoad={() => {
          // mark when the video has loaded
          performance.mark("video_ready")
          // now safely measure between the two marks
          performance.measure("TTFP", "video_mount", "video_ready")

          // read the measure
          const measures = performance.getEntriesByName("TTFP")
          const ttfp = measures[measures.length - 1]?.duration
          console.log(`[VIDEO] Article Embed Time to first play: ${ttfp?.toFixed(2)}ms`)
        }}
        source={{ uri: replacementURL }}
        style={{ height: height, width: "100%", aspectRatio: 16 / 9 }}
      />
    )
  }

  return (
    <Flex height={height} my={2}>
      <WebView
        source={{ uri: data.url }}
        style={{ flex: 1 }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </Flex>
  )
}
