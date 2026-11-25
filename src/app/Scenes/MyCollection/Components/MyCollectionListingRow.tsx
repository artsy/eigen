import { Color, Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import {
  MyCollectionListingRow_resaleSubmission$data,
  MyCollectionListingRow_resaleSubmission$key,
} from "__generated__/MyCollectionListingRow_resaleSubmission.graphql"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { getSellChannelName } from "app/utils/sellChannels"
import { graphql, useFragment } from "react-relay"

const IMAGE_WIDTH = 96
const STATE_DOT_SIZE = 8

type ListingState = MyCollectionListingRow_resaleSubmission$data["state"]

const STATE_DOT_COLORS: Partial<Record<ListingState, Color>> = {
  ACCEPTED: "orange100",
  LISTED: "green100",
  AUCTION_REVIEW: "green100",
  CANCELED: "mono30",
  REJECTED: "red100",
}

interface MyCollectionListingRowProps {
  resaleSubmission: MyCollectionListingRow_resaleSubmission$key
}

export const MyCollectionListingRow: React.FC<MyCollectionListingRowProps> = ({
  resaleSubmission,
}) => {
  const { internalID, state, statusMessage, channel, submittedArtwork } = useFragment(
    fragment,
    resaleSubmission
  )

  const dotColor = STATE_DOT_COLORS[state]
  const channelLabel = getSellChannelName(channel)

  return (
    <Touchable
      accessibilityRole="button"
      onPress={() => navigate(`/my-collection/resale-submissions/${internalID}`)}
      testID="my-collection-listing-row"
    >
      <Flex
        flexDirection="row"
        px={2}
        pt={2}
        pb={2}
        borderBottomWidth={1}
        borderBottomColor="mono10"
      >
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

          {!!channelLabel && (
            <Text variant="xs" color="mono60">
              {channelLabel}
            </Text>
          )}
        </Flex>
      </Flex>
    </Touchable>
  )
}

const fragment = graphql`
  fragment MyCollectionListingRow_resaleSubmission on ResaleSubmission {
    internalID
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
