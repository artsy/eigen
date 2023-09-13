import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { BellIcon, Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkAuctionCreateAlertHeader_artwork$key } from "__generated__/ArtworkAuctionCreateAlertHeader_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { hasBiddingEnded } from "app/Scenes/Artwork/utils/hasBiddingEnded"
import { isLotClosed } from "app/Scenes/Artwork/utils/isLotClosed"
import { navigate } from "app/system/navigation/navigate"
import { FC, useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkAuctionCreateAlertHeaderProps {
  artwork: ArtworkAuctionCreateAlertHeader_artwork$key
}

export const ArtworkAuctionCreateAlertHeader: FC<ArtworkAuctionCreateAlertHeaderProps> = ({
  artwork,
}) => {
  const tracking = useTracking()
  const artworkData = useFragment<ArtworkAuctionCreateAlertHeader_artwork$key>(
    artworkAuctionCreateAlertHeaderFragment,
    artwork
  )
  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)
  const { title, artistNames, isInAuction, sale, saleArtwork, internalID, slug } = artworkData
  const formattedArtistNames = artistNames ? artistNames + ", " : ""
  const hasArtists = artistNames?.length ?? 0 > 0

  const isLotClosedOrBiddingEnded =
    hasBiddingEnded(sale, saleArtwork) || isLotClosed(sale, saleArtwork)
  const displayAuctionCreateAlertHeader = hasArtists && isInAuction && isLotClosedOrBiddingEnded

  if (!displayAuctionCreateAlertHeader) {
    return null
  }

  const isBidder = artworkData.myLotStandingManageAlerts?.[0]
  const isHighest = artworkData.myLotStandingManageAlerts?.[0]?.isHighestBidder
  const hasLostBid = isBidder && !isHighest

  return (
    <>
      <CreateArtworkAlertModal
        artwork={artworkData}
        onClose={() => setShowCreateArtworkAlertModal(false)}
        contextModule={ContextModule.artworkClosedLotHeader}
        visible={showCreateArtworkAlertModal}
      />

      <Flex flexDirection="column">
        <Text variant="lg">
          Bidding for {formattedArtistNames}{" "}
          <Text variant="lg" italic>
            {title?.trim() + " "}
          </Text>
          has closed.
        </Text>

        <Spacer y={1} />

        <Text variant="sm" color="black60">
          {hasLostBid
            ? "We've created an alert for you for similar works. Browse hand picked artworks that match this lot"
            : "Get notified when similar works become available, or browse hand picked artworks that match this lot."}
        </Text>

        <Spacer y={2} />

        {hasLostBid ? (
          <Button
            size="large"
            variant="outline"
            haptic
            onPress={() => {
              navigate("/my-profile/saved-search-alerts")
            }}
            icon={<BellIcon fill="black100" />}
            flex={1}
          >
            Manage your Alerts
          </Button>
        ) : (
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
        )}

        <Spacer y={1} />

        <Button
          size="large"
          variant="outline"
          haptic
          onPress={() => {
            tracking.trackEvent(tracks.tappedBrowseSimilarWorksHeaderButton(internalID, slug))
          }}
          flex={1}
        >
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
    internalID
    slug
    sale {
      isClosed
      startAt
    }
    saleArtwork {
      endAt
      endedAt
      extendedBiddingEndAt
    }
    myLotStandingManageAlerts: myLotStanding {
      isHighestBidder
    }
    ...CreateArtworkAlertModal_artwork
  }
`

const tracks = {
  tappedBrowseSimilarWorksHeaderButton: (internalID: string, slug: string) => ({
    action: ActionType.tappedBrowseSimilarArtworks,
    context_module: ContextModule.artworkClosedLotHeader,
    context_screen_owner_type: OwnerType.artwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
  }),
}
