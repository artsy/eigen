import { BellIcon, Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkAuctionCreateAlertHeader_artwork$key } from "__generated__/ArtworkAuctionCreateAlertHeader_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { hasBiddingEnded } from "app/Scenes/Artwork/utils/hasBiddingEnded"
import { isLotClosed } from "app/Scenes/Artwork/utils/isLotClosed"
import { FC, useState } from "react"
import { graphql, useFragment } from "react-relay"

interface ArtworkAuctionCreateAlertHeaderProps {
  artwork: ArtworkAuctionCreateAlertHeader_artwork$key
}

export const ArtworkAuctionCreateAlertHeader: FC<ArtworkAuctionCreateAlertHeaderProps> = ({
  artwork,
}) => {
  const artworkData = useFragment<ArtworkAuctionCreateAlertHeader_artwork$key>(
    artworkAuctionCreateAlertHeaderFragment,
    artwork
  )
  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)
  const { title, artistNames, isInAuction, sale, saleArtwork } = artworkData
  const formattedArtistNames = artistNames ? artistNames + ", " : ""
  const hasArtists = artistNames?.length ?? 0 > 0

  const isLotClosedOrBiddingEnded =
    hasBiddingEnded(sale, saleArtwork) || isLotClosed(sale, saleArtwork)
  const displayAuctionCreateAlertHeader = hasArtists && isInAuction && isLotClosedOrBiddingEnded

  if (!displayAuctionCreateAlertHeader) {
    return null
  }

  return (
    <>
      <CreateArtworkAlertModal
        artwork={artworkData}
        onClose={() => setShowCreateArtworkAlertModal(false)}
        visible={showCreateArtworkAlertModal}
      />

      <Flex flexDirection="column">
        <Text variant="lg">
          Bidding for
          {formattedArtistNames}{" "}
          <Text variant="lg" italic>
            {title?.trim() + " "}
          </Text>
          has closed.
        </Text>

        <Spacer y={1} />

        <Text variant="sm" color="black60">
          Get notified when similar works become available, or browse hand picked artworks that
          match this lot.
        </Text>

        <Spacer y={2} />

        <Button
          size="large"
          variant="fillDark"
          haptic
          onPress={() => setShowCreateArtworkAlertModal(true)}
          icon={<BellIcon fill="white100" />}
          flex={1}
        >
          Create Alert
        </Button>

        <Spacer y={1} />

        <Button size="large" variant="outline" haptic onPress={() => {}} flex={1}>
          Browse Similar Artworks
        </Button>
      </Flex>
    </>
  )
}

const artworkAuctionCreateAlertHeaderFragment = graphql`
  fragment ArtworkAuctionCreateAlertHeader_artwork on Artwork {
    title
    artistNames
    isInAuction
    sale {
      isClosed
      startAt
    }
    saleArtwork {
      endAt
      endedAt
      extendedBiddingEndAt
    }
    ...CreateArtworkAlertModal_artwork
  }
`
