import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { BellIcon, Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkAuctionCreateAlertHeader_artwork$key } from "__generated__/ArtworkAuctionCreateAlertHeader_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { hasBiddingEnded } from "app/Scenes/Artwork/utils/hasBiddingEnded"
import { isLotClosed } from "app/Scenes/Artwork/utils/isLotClosed"
import { useCreateAlertTracking } from "app/Scenes/SavedSearchAlert/useCreateAlertTracking"
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
  const {
    artistNames,
    internalID,
    isEligibleToCreateAlert,
    isInAuction,
    sale,
    saleArtwork,
    slug,
    title,
  } = artworkData
  const formattedArtistNames = artistNames ? artistNames + ", " : ""

  const hasArtworksSuggestions =
    (artworkData.savedSearch?.suggestedArtworksConnection?.totalCount ?? 0) > 0

  const isLotClosedOrBiddingEnded =
    hasBiddingEnded(sale, saleArtwork) || isLotClosed(sale, saleArtwork)
  const displayAuctionCreateAlertHeader =
    isEligibleToCreateAlert && isInAuction && isLotClosedOrBiddingEnded

  const { trackCreateAlertTap } = useCreateAlertTracking({
    contextScreenOwnerType: OwnerType.artwork,
    contextScreenOwnerId: internalID,
    contextScreenOwnerSlug: slug,
    contextModule: ContextModule.artworkClosedLotHeader,
  })

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
        visible={showCreateArtworkAlertModal}
      />

      <Flex flexDirection="column" mb={2}>
        <Text variant="lg">
          Bidding for {formattedArtistNames}{" "}
          <Text variant="lg" italic>
            {title?.trim() + " "}
          </Text>
          has closed.
        </Text>

        <Spacer y={1} />

        <Text variant="sm" color="mono60">
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
              navigate("/favorites/alerts")
            }}
            icon={<BellIcon fill="mono100" />}
            block
          >
            Manage your Alerts
          </Button>
        ) : (
          <Button
            size="large"
            variant="fillDark"
            haptic
            onPress={() => {
              trackCreateAlertTap()
              setShowCreateArtworkAlertModal(true)
            }}
            icon={<BellIcon fill="mono0" />}
            block
          >
            Create Alert
          </Button>
        )}

        {!!hasArtworksSuggestions && (
          <Button
            size="large"
            variant="outline"
            haptic
            onPress={() => {
              tracking.trackEvent(tracks.tappedBrowseSimilarWorksHeaderButton(internalID, slug))
              navigate(`/artwork/${internalID}/browse-similar-works`)
            }}
            block
            mt={1}
          >
            Browse Similar Artworks
          </Button>
        )}
      </Flex>
    </>
  )
}

const artworkAuctionCreateAlertHeaderFragment = graphql`
  fragment ArtworkAuctionCreateAlertHeader_artwork on Artwork {
    title
    internalID
    isEligibleToCreateAlert
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
    savedSearch {
      suggestedArtworksConnection {
        totalCount
      }
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
