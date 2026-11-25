import { Flex, Text } from "@artsy/palette-mobile"
import { MyCollectionListingRow_resaleSubmission$key } from "__generated__/MyCollectionListingRow_resaleSubmission.graphql"
import { MyCollectionImageView } from "app/Scenes/MyCollection/Components/MyCollectionImageView"
import { graphql, useFragment } from "react-relay"

const IMAGE_WIDTH = 96

const STATE_DOT_COLORS: Record<string, string> = {
  ACCEPTED: "orange100",
  LISTED: "green100",
  AUCTION_REVIEW: "green100",
}

const CHANNEL_LABELS: Record<string, string> = {
  MARKETPLACE: "Artsy Listing",
  AUCTION: "Artnet Auction",
}

interface MyCollectionListingRowProps {
  resaleSubmission: MyCollectionListingRow_resaleSubmission$key
}

export const MyCollectionListingRow: React.FC<MyCollectionListingRowProps> = ({
  resaleSubmission,
}) => {
  const { state, statusMessage, channel, submittedArtwork } = useFragment(
    fragment,
    resaleSubmission
  )

  const dotColor = STATE_DOT_COLORS[state]
  const channelLabel = channel ? CHANNEL_LABELS[channel] : undefined

  return (
    <Flex
      flexDirection="row"
      px={2}
      pt="16px"
      pb="24px"
      borderBottomWidth={1}
      borderBottomColor="mono10"
      testID="my-collection-listing-row"
    >
      <MyCollectionImageView
        imageURL={submittedArtwork?.image?.url ?? undefined}
        imageWidth={IMAGE_WIDTH}
        aspectRatio={submittedArtwork?.image?.aspectRatio}
        blurhash={submittedArtwork?.image?.blurhash}
        artworkSlug={submittedArtwork?.slug ?? ""}
      />

      <Flex flex={1} ml="16px" gap={0.5}>
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
            <Flex testID="listing-state-dot" width={8} height={8} borderRadius={4} bg={dotColor} />
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
  )
}

const fragment = graphql`
  fragment MyCollectionListingRow_resaleSubmission on ResaleSubmission {
    state
    statusMessage
    channel
    submittedArtwork {
      slug
      artistNames
      title
      date
      image {
        url(version: ["larger", "large", "medium", "small", "square"])
        aspectRatio
        blurhash
      }
    }
  }
`
