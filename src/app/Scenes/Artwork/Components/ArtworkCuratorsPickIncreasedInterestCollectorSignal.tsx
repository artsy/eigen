import { Flex, Text, TrendingIcon, VerifiedIcon } from "@artsy/palette-mobile"
import { ArtworkCuratorsPickIncreasedInterestCollectorSignal_artwork$key } from "__generated__/ArtworkCuratorsPickIncreasedInterestCollectorSignal_artwork.graphql"
import { graphql, useFragment } from "react-relay"

interface Props {
  artwork: ArtworkCuratorsPickIncreasedInterestCollectorSignal_artwork$key
}

export const ArtworkCuratorsPickIncreasedInterestCollectorSignal: React.FC<Props> = ({
  artwork,
}) => {
  const { collectorSignals } = useFragment(fragment, artwork)

  if (!collectorSignals) {
    return null
  }

  const { increasedInterest, curatorsPick } = collectorSignals

  if (!increasedInterest && !curatorsPick) {
    return null
  }

  let singalTitle = "Curators’ Pick"
  let signalDescription = "Hand selected by Artsy curators this week"
  let SignalIcon = VerifiedIcon

  if (increasedInterest) {
    singalTitle = "Increased Interest"
    signalDescription = "Based on collector activity in the past 14 days"
    SignalIcon = TrendingIcon
  }

  return (
    <Flex flexDirection="row" mt={4} mb={2}>
      <SignalIcon mr={0.5} mt="2px" />

      <Flex flexDirection="column">
        <Text variant="sm-display" color="black100">
          {singalTitle}
        </Text>

        <Text variant="sm" color="black60">
          {signalDescription}
        </Text>
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtworkCuratorsPickIncreasedInterestCollectorSignal_artwork on Artwork {
    collectorSignals {
      increasedInterest
      curatorsPick
    }
  }
`
