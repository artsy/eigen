import { DEFAULT_ACTIVE_OPACITY, Flex, Text } from "@artsy/palette-mobile"
import { FeatureFeaturedLink_featuredLink$data } from "__generated__/FeatureFeaturedLink_featuredLink.graphql"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { navigate } from "app/system/navigation/navigate"
import { TouchableOpacity } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { createFragmentContainer, graphql } from "react-relay"
import { FeatureMarkdown } from "./FeatureMarkdown"

export interface FeatureFeaturedLinkProps {
  featuredLink: FeatureFeaturedLink_featuredLink$data
  width: number
}

const FeatureFeaturedLink: React.FC<FeatureFeaturedLinkProps> = ({ featuredLink, width }) => {
  return (
    <Flex style={{ width }}>
      <TouchableOpacity
        activeOpacity={DEFAULT_ACTIVE_OPACITY}
        onPress={() => {
          if (featuredLink.href) {
            navigate(featuredLink.href)
          }
        }}
      >
        <ImageWithFallback src={featuredLink.image?.url} width={width} height={(width / 3) * 4} />
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 180 }}
        />
        <Flex
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 20,
          }}
        >
          <Text variant="lg-display" color="mono0">
            {featuredLink.title}
          </Text>
          {!!featuredLink.subtitle && (
            <FeatureMarkdown content={featuredLink.subtitle} textProps={{ color: "mono0" }} />
          )}
        </Flex>
      </TouchableOpacity>
      {!!featuredLink.description && (
        <Flex pt={2}>
          <FeatureMarkdown content={featuredLink.description} textProps={{ variant: "md" }} />
        </Flex>
      )}
    </Flex>
  )
}

export const FeatureFeaturedLinkFragmentContainer = createFragmentContainer(FeatureFeaturedLink, {
  featuredLink: graphql`
    fragment FeatureFeaturedLink_featuredLink on FeaturedLink {
      href
      title
      subtitle
      description
      image {
        url(version: "wide")
      }
    }
  `,
})
