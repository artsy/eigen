import {
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  tappedEntityGroup,
  TappedEntityGroupArgs,
} from "@artsy/cohesion"
import { SaleArtworkListItem_artwork$data } from "__generated__/SaleArtworkListItem_artwork.graphql"
import { saleMessageOrBidInfo } from "app/Components/ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { Flex, Sans } from "palette"
import { Touchable } from "palette"
import React, { useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  artwork: SaleArtworkListItem_artwork$data
  contextScreenOwnerType?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
}

const CONTAINER_HEIGHT = 100

export const SaleArtworkListItem: React.FC<Props> = ({ artwork, contextScreenOwnerType }) => {
  const itemRef = useRef<any>()
  const tracking = useTracking()

  const onPress = () => {
    trackArtworkTap()
    navigate(artwork.href!)
  }

  const trackArtworkTap = () => {
    if (contextScreenOwnerType) {
      const trackingArgs: TappedEntityGroupArgs = {
        contextModule: ContextModule.artworkGrid,
        contextScreenOwnerType: OwnerType.sale,
        contextScreenOwnerId: artwork.internalID,
        contextScreenOwnerSlug: artwork.slug,
        destinationScreenOwnerType: OwnerType.artwork,
        type: "thumbnail",
      }

      tracking.trackEvent(tappedEntityGroup(trackingArgs))
    }
  }

  const saleInfo = saleMessageOrBidInfo({
    artwork,
  })

  const imageDimensions = getImageDimensions(
    artwork.image?.height,
    artwork.image?.width,
    CONTAINER_HEIGHT
  )

  return (
    <Touchable onPress={onPress}>
      <Flex flexDirection="row" alignItems="center" height={CONTAINER_HEIGHT} ref={itemRef}>
        {!!artwork.image && (
          <Flex
            height={CONTAINER_HEIGHT}
            width={CONTAINER_HEIGHT}
            alignItems="center"
            justifyContent="center"
          >
            <OpaqueImageView
              imageURL={artwork.image?.small}
              height={imageDimensions.height}
              width={imageDimensions.width}
              aspectRatio={artwork.image?.aspectRatio ?? 1}
            />
          </Flex>
        )}

        <Flex ml={2} height={100} flex={1} justifyContent="center">
          {!!artwork.saleArtwork?.lotLabel && (
            <Sans size="3t" color="black60" numberOfLines={1}>
              Lot {artwork.saleArtwork.lotLabel}
            </Sans>
          )}
          {!!artwork.artistNames && (
            <Sans size="3t" weight="medium" numberOfLines={1}>
              {artwork.artistNames}
            </Sans>
          )}
          {!!artwork.title && (
            <Sans size="3t" color="black60" numberOfLines={2}>
              {artwork.title}
              {!!artwork.date && `, ${artwork.date}`}
            </Sans>
          )}
          {!!saleInfo && (
            <Sans color="black60" size="3t" numberOfLines={1}>
              {saleInfo}
            </Sans>
          )}
        </Flex>
      </Flex>
    </Touchable>
  )
}

// Get image accurate square dimensions while keeping the same aspect ratio
export const getImageDimensions = (
  height: number | null | undefined,
  width: number | null | undefined,
  containerHeight: number
) => {
  if (height && width) {
    if (height > width) {
      return {
        height: containerHeight,
        width: (width * containerHeight) / height,
      }
    }
    return {
      height: (height * containerHeight) / width,
      width: containerHeight,
    }
  }
  return {
    height: containerHeight,
    width: containerHeight,
  }
}

export const SaleArtworkListItemContainer = createFragmentContainer(SaleArtworkListItem, {
  artwork: graphql`
    fragment SaleArtworkListItem_artwork on Artwork {
      artistNames
      date
      href
      image {
        small: url(version: "small")
        aspectRatio
        height
        width
      }
      realizedPrice
      saleMessage
      slug
      title
      internalID
      sale {
        isAuction
        isClosed
        displayTimelyAt
        endAt
      }
      saleArtwork {
        counts {
          bidderPositions
        }
        currentBid {
          display
        }
        lotLabel
      }
    }
  `,
})
