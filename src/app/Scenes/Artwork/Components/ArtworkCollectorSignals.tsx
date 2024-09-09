import { Box, FairIcon, Flex, LinkText, Text } from "@artsy/palette-mobile"
import { ArtworkCollectorSignals_artwork$data } from "__generated__/ArtworkCollectorSignals_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { DateTime } from "luxon"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkCollectorSignalsProps {
  artwork: ArtworkCollectorSignals_artwork$data
}

const ArtworkCollectorSignals: React.FC<ArtworkCollectorSignalsProps> = ({ artwork }) => {
  const { collectorSignals } = artwork
  const runningShow = collectorSignals?.runningShow

  if (!runningShow) {
    return null
  }

  const showStartsAt: string = DateTime.fromISO(runningShow.startAt || "").toFormat("MMM d")
  const showEndAt: string = DateTime.fromISO(runningShow.endAt || "").toFormat("MMM d")

  return (
    <Box mt={4} mb={2}>
      <Flex testID="artwork-collector-ssignals" flexDirection="row" alignContent="center">
        <FairIcon mr={0.5} fill="black60" height={25} width={25} />
        <Flex testID="artwork-collector-ssignals" flexDirection="column" alignContent="left">
          <Text variant="sm" color="black100">
            Showing now{"  •  "}
            {showStartsAt} - {showEndAt}
          </Text>

          <LinkText variant="sm" color="black60" onPress={() => navigate(runningShow.href || "#")}>
            {runningShow.name}
          </LinkText>
        </Flex>
      </Flex>
    </Box>
  )
}

export const ArtworkCollectorSignalsFragmentContainer = createFragmentContainer(
  ArtworkCollectorSignals,
  {
    artwork: graphql`
      fragment ArtworkCollectorSignals_artwork on Artwork {
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
