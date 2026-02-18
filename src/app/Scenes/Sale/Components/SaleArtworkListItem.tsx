import {
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  tappedEntityGroup,
  TappedEntityGroupArgs,
} from "@artsy/cohesion"
import { Flex, Image, Text } from "@artsy/palette-mobile"
import { SaleArtworkListItem_artwork$data } from "__generated__/SaleArtworkListItem_artwork.graphql"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { RouterLink } from "app/system/navigation/RouterLink"
import { saleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { getImageSquareDimensions } from "app/utils/resizeImage"
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
  const itemRef = useRef<any>(null)
  const tracking = useTracking()

  const onPress = () => {
    if (artwork.href) {
      trackArtworkTap()
    }
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

  const imageDimensions = getImageSquareDimensions(
    artwork.image?.height,
    artwork.image?.width,
    CONTAINER_HEIGHT
  )

  return (
    <AnalyticsContextProvider
      contextScreenOwnerType={OwnerType.sale}
      contextScreenOwnerId={artwork.internalID}
      contextScreenOwnerSlug={artwork.slug}
    >
      <RouterLink onPress={onPress} to={artwork.href}>
        <Flex flexDirection="row" alignItems="center" height={CONTAINER_HEIGHT} ref={itemRef}>
          {!!artwork.image?.small && (
            <Flex
              height={CONTAINER_HEIGHT}
              width={CONTAINER_HEIGHT}
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src={artwork.image?.small}
                height={imageDimensions.height}
                width={imageDimensions.width}
                aspectRatio={artwork.image?.aspectRatio ?? 1}
              />
            </Flex>
          )}

          <Flex ml={2} height={100} flex={1} justifyContent="center">
            {!!artwork.saleArtwork?.lotLabel && (
              <Text variant="sm" color="mono60" numberOfLines={1}>
                Lot {artwork.saleArtwork.lotLabel}
              </Text>
            )}
            {!!artwork.artistNames && (
              <Text variant="sm" weight="medium" numberOfLines={1}>
                {artwork.artistNames}
              </Text>
            )}
            {!!artwork.title && (
              <Text variant="sm" color="mono60" numberOfLines={2}>
                {artwork.title}
                {!!artwork.date && `, ${artwork.date}`}
              </Text>
            )}
            {!!saleInfo && (
              <Text variant="sm" color="mono60" numberOfLines={1}>
                {saleInfo}
              </Text>
            )}
          </Flex>
        </Flex>
      </RouterLink>
    </AnalyticsContextProvider>
  )
}

export const SaleArtworkListItemContainer = createFragmentContainer(SaleArtworkListItem, {
  artwork: graphql`
    fragment SaleArtworkListItem_artwork on Artwork {
      artistNames
      date
      href
      image(includeAll: false) {
        small: url(version: "small")
        aspectRatio
        height
        width
      }
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
