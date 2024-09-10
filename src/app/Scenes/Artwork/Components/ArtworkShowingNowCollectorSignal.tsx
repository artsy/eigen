import { Box, bullet, FairIcon, Flex, LinkText, Text } from "@artsy/palette-mobile"
import { ArtworkShowingNowCollectorSignal_artwork$data } from "__generated__/ArtworkShowingNowCollectorSignal_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { DateTime } from "luxon"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkShowingNowCollectorSignalProps {
  artwork: ArtworkShowingNowCollectorSignal_artwork$data
}

const ArtworkShowingNowCollectorSignal: React.FC<ArtworkShowingNowCollectorSignalProps> = ({
  artwork,
}) => {
  const { collectorSignals } = artwork
  const runningShow = collectorSignals?.runningShow

  if (!runningShow || !runningShow.startAt || !runningShow.endAt) {
    return null
  }

  const showStartsAt: string = DateTime.fromISO(runningShow.startAt).toFormat("MMM d")
  const showEndAt: string = DateTime.fromISO(runningShow.endAt).toFormat("MMM d")

  return (
    <Box mt={4} mb={2}>
      <Flex
        testID="artwork-showing-now-collector-ssignal"
        flexDirection="row"
        alignContent="center"
      >
        <FairIcon mr={0.5} fill="black60" height={25} width={25} />
        <Flex flexDirection="column" alignContent="left">
          <Text variant="sm" color="black100">
            Showing now {bullet} {showStartsAt} - {showEndAt}
          </Text>

          <LinkText variant="sm" color="black60" onPress={() => navigate(runningShow.href || "#")}>
            {runningShow.name}
          </LinkText>
        </Flex>
      </Flex>
    </Box>
  )
}

export const ArtworkShowingNowCollectorSignalFragmentContainer = createFragmentContainer(
  ArtworkShowingNowCollectorSignal,
  {
    artwork: graphql`
      fragment ArtworkShowingNowCollectorSignal_artwork on Artwork {
        collectorSignals {
          runningShow {
            endAt
            href
            name
            startAt
          }
        }
      }
    `,
  }
)
