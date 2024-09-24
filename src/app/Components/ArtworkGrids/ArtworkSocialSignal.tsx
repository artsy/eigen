import { Box, Text } from "@artsy/palette-mobile"
import { ArtworkSocialSignal_collectorSignals$key } from "__generated__/ArtworkSocialSignal_collectorSignals.graphql"
import { graphql, useFragment } from "react-relay"

interface ArtworkSocialSignalProps {
  collectorSignals: ArtworkSocialSignal_collectorSignals$key
  hideIncreasedInterest?: boolean
  hideCuratorsPick?: boolean
  dark?: boolean
}
export const ArtworkSocialSignal: React.FC<ArtworkSocialSignalProps> = ({
  collectorSignals,
  hideCuratorsPick,
  hideIncreasedInterest,
  dark = false,
}) => {
  const { curatorsPick, increasedInterest } = useFragment(fragment, collectorSignals)

  const primaryColor = dark ? "white100" : "black100"

  switch (true) {
    case curatorsPick && !hideCuratorsPick:
      return (
        <Box
          px={0.5}
          pb="2px"
          alignSelf="flex-start"
          borderRadius={3}
          borderWidth={1}
          borderColor={primaryColor}
          mb={0.5}
        >
          <Text color={primaryColor} variant="xxs">
            Curators’ Pick
          </Text>
        </Box>
      )

    case increasedInterest && !hideIncreasedInterest:
      return (
        <Box
          px={0.5}
          pb="2px"
          alignSelf="flex-start"
          borderRadius={3}
          borderWidth={1}
          borderColor={primaryColor}
          mb={0.5}
        >
          <Text color={primaryColor} variant="xxs">
            Increased Interest
          </Text>
        </Box>
      )

    default:
      return null
  }
}

const fragment = graphql`
  fragment ArtworkSocialSignal_collectorSignals on CollectorSignals {
    increasedInterest
    curatorsPick
  }
`
