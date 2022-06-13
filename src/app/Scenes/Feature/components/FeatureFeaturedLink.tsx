import { FeatureFeaturedLink_featuredLink$data } from "__generated__/FeatureFeaturedLink_featuredLink.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { Flex, Sans } from "palette"
import React from "react"
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
        activeOpacity={0.9}
        onPress={
          featuredLink.href
            ? () => {
                navigate(featuredLink.href!)
              }
            : undefined
        }
      >
        <OpaqueImageView
          imageURL={featuredLink.image?.url}
          width={width}
          height={(width / 3) * 4}
        />
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
          <Sans size="6" color="white">
            {featuredLink.title}
          </Sans>
          {!!featuredLink.subtitle && (
            <FeatureMarkdown content={featuredLink.subtitle} sansProps={{ color: "white" }} />
          )}
        </Flex>
      </TouchableOpacity>
      {!!featuredLink.description && (
        <Flex pt="2">
          <FeatureMarkdown content={featuredLink.description} sansProps={{ size: "4" }} />
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
