import { ArrowUpRightIcon, Box, FireIcon, Text } from "@artsy/palette-mobile"
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
        <Box alignItems="center" flexDirection="row">
          <FireIcon />
          <Text color={primaryColor} variant="xs" pl="3px" textAlign="center">
            Curators’ Pick
          </Text>
        </Box>
      )

    case increasedInterest && !hideIncreasedInterest:
      return (
        <Box flexDirection="row" alignItems="center">
          <ArrowUpRightIcon />
          <Text color={primaryColor} variant="xs">
            {" "}
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
