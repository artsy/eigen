import { Flex, FlexProps, Image, Text, useColor } from "@artsy/palette-mobile"
import { FeatureHeader_feature$data } from "__generated__/FeatureHeader_feature.graphql"
import { Stack } from "app/Components/Stack"
import { useScreenDimensions } from "app/utils/hooks"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import { FeatureMarkdown } from "./FeatureMarkdown"

export interface FeatureHeaderProps extends FlexProps {
  feature: FeatureHeader_feature$data
}

export const FeatureHeader: React.FC<FeatureHeaderProps> = ({ feature }) => {
  const { height, width } = useScreenDimensions()
  const color = useColor()

  const imageHeight = isTablet() ? height * 0.6 : width
  const imageWidth = isTablet() ? width / 2 : width

  const image = !!feature.image?.url ? (
    <Image src={feature.image?.url} width={imageWidth} height={imageHeight} />
  ) : null
  const title = (
    <Text
      variant="lg-display"
      style={{ fontSize: 42, lineHeight: 50, maxWidth: "80%" }}
      textAlign="center"
    >
      {feature.name}
    </Text>
  )
  const subtitle = !!feature.subheadline && (
    <FeatureMarkdown
      content={feature.subheadline}
      textProps={{ textAlign: "center", variant: "md" }}
    />
  )

  return isTablet() ? (
    <Flex flexDirection="row" borderBottomWidth={1} borderBottomColor={color("mono100")}>
      <Flex flex={1} alignItems="center" justifyContent="center">
        {image}
      </Flex>
      <Stack px={2} alignItems="center" justifyContent="center" flex={1}>
        {title}
        {subtitle}
      </Stack>
    </Flex>
  ) : (
    <Stack spacing={4} borderBottomWidth={1} borderBottomColor={color("mono100")} pb={4}>
      {image}
      <Stack mx={2} alignItems="center">
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
  const imageHeight = isTablet() ? height * 0.6 : width

  return isTablet() ? (
    <Flex flexDirection="row" borderBottomWidth={1} borderBottomColor="mono100">
      <PlaceholderBox height={imageHeight} flex={1} />
      <Stack px={2} alignItems="center" justifyContent="center" flex={1}>
        <PlaceholderText width={220} />
        <PlaceholderText width={330} />
      </Stack>
    </Flex>
  ) : (
    <Stack spacing={4} borderBottomWidth={1} borderBottomColor="mono100" pb={4}>
      <PlaceholderBox height={imageHeight} />
      <Stack mx={2} alignItems="center" justifyContent="center" minHeight={140}>
        <PlaceholderText width={220} />
        <PlaceholderText width={330} />
      </Stack>
    </Stack>
  )
}
