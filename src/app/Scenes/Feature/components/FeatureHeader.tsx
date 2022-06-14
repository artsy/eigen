import { FeatureHeader_feature$data } from "__generated__/FeatureHeader_feature.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Stack } from "app/Components/Stack"
import { isPad } from "app/utils/hardware"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { Flex, FlexProps, Sans } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { FeatureMarkdown } from "./FeatureMarkdown"

export interface FeatureHeaderProps extends FlexProps {
  feature: FeatureHeader_feature$data
}

export const FeatureHeader: React.FC<FeatureHeaderProps> = ({ feature }) => {
  const { height, width } = useScreenDimensions()
  const imageHeight = isPad() ? height * 0.6 : width
  const imageWidth = isPad() ? width / 2 : width

  const image = (
    <OpaqueImageView imageURL={feature.image?.url} width={imageWidth} height={imageHeight} />
  )
  const title = (
    <Sans size="8" style={{ fontSize: 42, lineHeight: 50 }} maxWidth="80%" textAlign="center">
      {feature.name}
    </Sans>
  )
  const subtitle = !!feature.subheadline && (
    <FeatureMarkdown content={feature.subheadline} sansProps={{ textAlign: "center", size: "4" }} />
  )
  return isPad() ? (
    <Flex flexDirection="row" borderBottomWidth={1} borderBottomColor="black">
      <Flex flex={1} alignItems="center" justifyContent="center">
        {image}
      </Flex>
      <Stack px="2" alignItems="center" justifyContent="center" flex={1}>
        {title}
        {subtitle}
      </Stack>
    </Flex>
  ) : (
    <Stack spacing={4} borderBottomWidth={1} borderBottomColor="black" pb="4">
      {image}
      <Stack mx="2" alignItems="center">
        {title}
        {subtitle}
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
        url(version: "source")
      }
    }
  `,
})

export const FeatureHeaderPlaceholder: React.FC<{}> = ({}) => {
  const { height, width } = useScreenDimensions()
  const imageHeight = isPad() ? height * 0.6 : width

  return isPad() ? (
    <Flex flexDirection="row" borderBottomWidth={1} borderBottomColor="black">
      <PlaceholderBox height={imageHeight} flex={1} />
      <Stack px="2" alignItems="center" justifyContent="center" flex={1}>
        <PlaceholderText width={220} />
        <PlaceholderText width={330} />
      </Stack>
    </Flex>
  ) : (
    <Stack spacing={4} borderBottomWidth={1} borderBottomColor="black" pb="4">
      <PlaceholderBox height={imageHeight} />
      <Stack mx="2" alignItems="center" justifyContent="center" minHeight={140}>
        <PlaceholderText width={220} />
        <PlaceholderText width={330} />
      </Stack>
    </Stack>
  )
}
