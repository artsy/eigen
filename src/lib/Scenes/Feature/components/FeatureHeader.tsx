import { Flex, FlexProps, Sans, Separator } from "@artsy/palette"
import { FeatureHeader_feature } from "__generated__/FeatureHeader_feature.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Stack } from "lib/Components/Stack"
import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { FeatureMarkdown } from "./FeatureMarkdown"

export interface FeatureHeaderProps extends FlexProps {
  feature: FeatureHeader_feature
}

export const FeatureHeader: React.FC<FeatureHeaderProps> = ({ feature }) => {
  const { width } = useScreenDimensions()
  const ratio = feature.image?.aspectRatio ?? 1
  const imageWidth = isPad() ? width / 2 : width
  const imageHeight = imageWidth / ratio

  const image = <OpaqueImageView imageURL={feature.image?.url} width={imageWidth} height={imageHeight} />
  const title = (
    <Sans size="8" maxWidth="80%" textAlign="center">
      {feature.name}
    </Sans>
  )
  const subtitle = !!feature.subheadline && (
    <FeatureMarkdown content={feature.subheadline} sansProps={{ color: "black60", textAlign: "center", size: "4" }} />
  )
  return isPad() ? (
    <Flex flexDirection="row">
      <Flex flex={1} alignItems="center" justifyContent="center">
        {image}
      </Flex>
      <Flex flex={1}>
        <Stack px="2" alignItems="center" justifyContent="center" flex={1}>
          {title}
          {subtitle}
        </Stack>
        <Separator />
      </Flex>
    </Flex>
  ) : (
    <Stack spacing={4}>
      {image}
      <Stack mx="2" alignItems="center">
        {title}
        {subtitle}
      </Stack>
      <Separator />
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
