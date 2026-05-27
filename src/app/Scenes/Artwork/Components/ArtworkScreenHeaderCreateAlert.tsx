import { ContextModule, OwnerType } from "@artsy/cohesion"
import { BellStrokeIcon } from "@artsy/icons/native"
import { Button, Flex } from "@artsy/palette-mobile"
import { ArtworkScreenHeaderCreateAlert_artwork$key } from "__generated__/ArtworkScreenHeaderCreateAlert_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { lotIsClosed } from "app/Scenes/Artwork/utils/lotIsClosed"
import { useCreateAlertTracking } from "app/Scenes/SavedSearchAlert/useCreateAlertTracking"
import { getTimer } from "app/utils/getTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"

interface ArtworkScreenHeaderCreateAlertProps {
  artworkRef: ArtworkScreenHeaderCreateAlert_artwork$key
}

export const ArtworkScreenHeaderCreateAlert: React.FC<ArtworkScreenHeaderCreateAlertProps> = ({
  artworkRef,
}) => {
  const artwork = useFragment<ArtworkScreenHeaderCreateAlert_artwork$key>(
    ArtworkScreenHeaderCreateAlert_artwork,
    artworkRef
  )
  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)
  const { isForSale, sale, saleArtwork, isInAuction, isEligibleToCreateAlert, internalID, slug } =
    artwork

  const enableAuctionHeaderAlertCTA = useFeatureFlag("AREnableAuctionHeaderAlertCTA")
  const biddingEndAt = saleArtwork?.extendedBiddingEndAt ?? saleArtwork?.endAt
  const { hasEnded } = getTimer(biddingEndAt as string, sale?.startAt as string)

  const isLotClosed = hasEnded || lotIsClosed(sale, saleArtwork)

  const displayCreateAlertHeader = isInAuction && isLotClosed && enableAuctionHeaderAlertCTA

  const { trackCreateAlertTap } = useCreateAlertTracking({
    contextScreenOwnerType: OwnerType.artwork,
    contextScreenOwnerId: internalID,
    contextScreenOwnerSlug: slug,
    contextModule: "ArtworkScreenHeader" as ContextModule,
  })

  if (!!displayCreateAlertHeader || !isEligibleToCreateAlert) {
    return null
  }

  return (
    <Flex>
      <Button
        size="small"
        variant={isForSale ? "outline" : "fillDark"}
        haptic
        onPress={() => {
          trackCreateAlertTap()
          setShowCreateArtworkAlertModal(true)
        }}
        icon={<BellStrokeIcon fill={isForSale ? "mono100" : "mono0"} />}
      >
        Create Alert
      </Button>

      <CreateArtworkAlertModal
        artwork={artwork}
        onClose={() => setShowCreateArtworkAlertModal(false)}
        visible={showCreateArtworkAlertModal}
      />
    </Flex>
  )
}

const ArtworkScreenHeaderCreateAlert_artwork = graphql`
  fragment ArtworkScreenHeaderCreateAlert_artwork on Artwork {
    internalID
    slug
    isEligibleToCreateAlert
    isInAuction
    ...CreateArtworkAlertModal_artwork
    artists(shallow: true) {
      internalID
    }
    isForSale
    sale {
      isClosed
      startAt
    }
    saleArtwork {
      endAt
      endedAt
      extendedBiddingEndAt
    }
  }
`
