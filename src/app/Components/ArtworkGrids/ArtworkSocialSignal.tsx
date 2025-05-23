import { ArrowUpRightIcon, FireIcon } from "@artsy/icons/native"
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

  const primaryColor = dark ? "mono0" : "mono100"

  switch (true) {
    case curatorsPick && !hideCuratorsPick:
      return (
        <Box alignItems="center" flexDirection="row">
          <FireIcon fill="mono100" />
          <Text color={primaryColor} variant="xs" textAlign="center">
            {" "}
            Curators’ Pick
          </Text>
        </Box>
      )

    case increasedInterest && !hideIncreasedInterest:
      return (
        <Box flexDirection="row" alignItems="center">
          <ArrowUpRightIcon fill="mono100" />
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
