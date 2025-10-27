import { Flex } from "@artsy/palette-mobile"
import { ArticleSectionEmbed_section$key } from "__generated__/ArticleSectionEmbed_section.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Platform } from "react-native"
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
    return (
      <Video
        repeat
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
