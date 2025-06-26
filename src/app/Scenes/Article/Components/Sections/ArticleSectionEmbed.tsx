import { Flex } from "@artsy/palette-mobile"
import { ArticleSectionEmbed_section$key } from "__generated__/ArticleSectionEmbed_section.graphql"
import { Platform } from "react-native"
import { WebView } from "react-native-webview"
import { useFragment, graphql } from "react-relay"

interface ArticleSectionEmbedProps {
  section: ArticleSectionEmbed_section$key
}

export const ArticleSectionEmbed: React.FC<ArticleSectionEmbedProps> = ({ section }) => {
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
