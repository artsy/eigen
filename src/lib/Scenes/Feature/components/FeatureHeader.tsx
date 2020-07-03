import { Flex, FlexProps, Sans } from "@artsy/palette"
import { FeatureHeader_feature } from "__generated__/FeatureHeader_feature.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Stack } from "lib/Components/Stack"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { FeatureMarkdown } from "./FeatureMarkdown"

export interface FeatureHeaderProps extends FlexProps {
  feature: FeatureHeader_feature
}

export const FeatureHeader: React.FC<FeatureHeaderProps> = ({ feature }) => {
  const { width } = useScreenDimensions()
  return (
    <Stack spacing={4}>
      <OpaqueImageView imageURL={feature.image?.url} width={width} height={440} />
      <Stack mx="2" alignItems="center">
        <Sans size="8" maxWidth="80%" textAlign="center">
          {feature.name}
        </Sans>
        {!!feature.subheadline && (
          <FeatureMarkdown content={feature.subheadline} sansProps={{ color: "black60", textAlign: "center" }} />
        )}
      </Stack>
    </Stack>
  )
}

export const FeatureHeaderFragmentContainer = createFragmentContainer(FeatureHeader, {
  feature: graphql`
    fragment FeatureHeader_feature on Feature {
      name
      subheadline
      image {
        aspectRatio
        url(version: "source")
      }
    }
  `,
})
