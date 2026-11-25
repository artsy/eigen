import { Button, Color, Flex, Image, Text } from "@artsy/palette-mobile"
import {
  ListingRow_resaleSubmission$data,
  ListingRow_resaleSubmission$key,
} from "__generated__/ListingRow_resaleSubmission.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { getSellChannelName } from "app/utils/sellChannels"
import { graphql, useFragment } from "react-relay"

const IMAGE_WIDTH = 80
const STATE_DOT_SIZE = 8

type ListingState = ListingRow_resaleSubmission$data["state"]

const STATE_DOT_COLORS: Partial<Record<ListingState, Color>> = {
  ACCEPTED: "orange100",
  LISTED: "green100",
  AUCTION_REVIEW: "green100",
  CANCELED: "mono30",
  REJECTED: "red100",
}

interface ListingRowProps {
  resaleSubmission: ListingRow_resaleSubmission$key
}

export const ListingRow: React.FC<ListingRowProps> = ({ resaleSubmission }) => {
  const { internalID, isEditable, state, statusMessage, channel, submittedArtwork } = useFragment(
    fragment,
    resaleSubmission
  )

  const dotColor = STATE_DOT_COLORS[state]
  const channelLabel = getSellChannelName(channel)

  return (
    <RouterLink
      accessibilityRole="button"
      to={`/my-collection/resale-submissions/${internalID}`}
      testID="my-collection-listing-row"
    >
      <Flex flexDirection="row" pt={2} pb={2} borderBottomWidth={1} borderBottomColor="mono10">
        {submittedArtwork?.image?.url ? (
          <Image
            src={submittedArtwork.image.url}
            width={IMAGE_WIDTH}
            aspectRatio={submittedArtwork.image.aspectRatio}
            blurhash={submittedArtwork.image.blurhash}
          />
        ) : (
          <Flex width={IMAGE_WIDTH} height={IMAGE_WIDTH} bg="mono10" />
        )}

        <Flex flex={1} ml={2} gap={0.5}>
          <Text variant="sm-display" color="mono100">
            {submittedArtwork?.artistNames}
          </Text>

          <Text variant="sm" color="mono60">
            <Text variant="sm" color="mono60" italic>
              {submittedArtwork?.title}
            </Text>
            {submittedArtwork?.date ? `, ${submittedArtwork.date}` : ""}
          </Text>

          <Flex flexDirection="row" alignItems="center" gap={0.5}>
            {!!dotColor && (
              <Flex
                width={STATE_DOT_SIZE}
                height={STATE_DOT_SIZE}
                borderRadius={STATE_DOT_SIZE / 2}
                bg={dotColor}
              />
            )}
            <Text variant="xs" color="mono60">
              {statusMessage}
            </Text>
          </Flex>

          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
            mt={0.5}
          >
            {!!channelLabel && (
              <Flex bg="mono5" borderRadius={50} px={1} py={0.5}>
                <Text variant="xs" color="mono100">
                  {channelLabel}
                </Text>
              </Flex>
            )}

            {!!isEditable && (
              <Button
                haptic
                size="small"
                variant="fillDark"
                onPress={() =>
                  navigate("/my-collection/sell", { passProps: { resaleSubmissionID: internalID } })
                }
              >
                Finish listing
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const fragment = graphql`
  fragment ListingRow_resaleSubmission on ResaleSubmission {
    internalID
    isEditable
    state
    statusMessage
    channel
    submittedArtwork {
      artistNames
      title
      date
      image {
        url(version: ["medium", "small"])
        aspectRatio
        blurhash
      }
    }
  }
`
