import {
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  tappedEntityGroup,
  TappedEntityGroupArgs,
} from "@artsy/cohesion"
import { themeGet } from "@styled-system/theme-get"
import { SaleArtworkTileRailCard_saleArtwork } from "__generated__/SaleArtworkTileRailCard_saleArtwork.graphql"
import { Box, Flex, Text, useColor } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { saleMessageOrBidInfo } from "../ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

export const CONTAINER_HEIGHT = 120

const SaleArtworkCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.white100"),
  activeOpacity: 0.8,
}))``

export interface SaleArtworkTileRailCardProps {
  onPress: () => void
  saleArtwork: SaleArtworkTileRailCard_saleArtwork
  useCustomSaleMessage?: boolean
  useSquareAspectRatio?: boolean
  contextScreenOwnerType?: ScreenOwnerType
}

export const SaleArtworkTileRailCard: React.FC<SaleArtworkTileRailCardProps> = ({
  onPress,
  saleArtwork,
  useCustomSaleMessage = false,
  useSquareAspectRatio = false,
  contextScreenOwnerType,
}) => {
  const color = useColor()
  const tracking = useTracking()
  const artwork = saleArtwork.artwork!

  const handleTap = () => {
    if (contextScreenOwnerType) {
      const trackingArgs: TappedEntityGroupArgs = {
        contextModule: ContextModule.auctionRail,
        contextScreenOwnerType: OwnerType.sale,
        contextScreenOwnerId: artwork.internalID,
        contextScreenOwnerSlug: artwork.slug,
        destinationScreenOwnerType: OwnerType.artwork,
        type: "thumbnail",
      }

      tracking.trackEvent(tappedEntityGroup(trackingArgs))
    }
    onPress()
  }

  if (!!artwork.image?.imageURL && !artwork.image?.aspectRatio && !useSquareAspectRatio) {
    throw new Error("imageAspectRatio is required for non-square images")
  }

  const imageWidth = useSquareAspectRatio
    ? CONTAINER_HEIGHT
    : (artwork.image?.aspectRatio ?? 1) * CONTAINER_HEIGHT

  const imageDisplay = artwork.image?.imageURL ? (
    <OpaqueImageView
      imageURL={artwork.image.imageURL}
      width={imageWidth}
      height={CONTAINER_HEIGHT}
      style={{
        borderRadius: 2,
        overflow: "hidden",
        justifyContent: "flex-end",
        paddingHorizontal: 5,
        paddingBottom: 5,
      }}
    />
  ) : (
    <Box
      bg={color("black30")}
      width={CONTAINER_HEIGHT}
      height={CONTAINER_HEIGHT}
      style={{ borderRadius: 2 }}
    />
  )

  const artistNamesDisplay = artwork.artistNames ? (
    <Text color="black60" lineHeight="20" numberOfLines={1}>
      {artwork.artistNames}
    </Text>
  ) : null

  const saleMessageDisplay = artwork.saleMessage ? (
    <Text variant="xs" lineHeight="20" numberOfLines={1}>
      {artwork.saleMessage}
    </Text>
  ) : null

  const customSaleMessage = saleMessageOrBidInfo({
    artwork: {
      sale: saleArtwork.sale,
      saleArtwork,
      saleMessage: saleArtwork.artwork?.saleMessage || null,
      realizedPrice: saleArtwork.artwork?.realizedPrice || null,
    },
    isSmallTile: true,
  })

  const customSaleMessageDisplay = useCustomSaleMessage ? (
    <Text variant="xs" lineHeight="20" numberOfLines={1}>
      {customSaleMessage}
    </Text>
  ) : null

  const titleAndDateDisplay =
    artwork.title || artwork.date ? (
      <Text color="black60" lineHeight="20" numberOfLines={1}>
        {[artwork.title, artwork.date].filter(Boolean).join(", ")}
      </Text>
    ) : null

  const lotNumber = saleArtwork.lotLabel ? (
    <Text numberOfLines={1} lineHeight="20" variant="sm">
      Lot {saleArtwork.lotLabel}
    </Text>
  ) : null

  return (
    <SaleArtworkCard onPress={handleTap}>
      <Flex>
        {imageDisplay}
        <Box mt={1} width={CONTAINER_HEIGHT}>
          {lotNumber}
          {artistNamesDisplay}
          {titleAndDateDisplay}
          {customSaleMessage ? customSaleMessageDisplay : saleMessageDisplay}
        </Box>
      </Flex>
    </SaleArtworkCard>
  )
}

export const SaleArtworkTileRailCardContainer = createFragmentContainer(SaleArtworkTileRailCard, {
  saleArtwork: graphql`
    fragment SaleArtworkTileRailCard_saleArtwork on SaleArtwork {
      artwork {
        artistNames
        date
        href
        image {
          imageURL: url(version: "small")
          aspectRatio
        }
        internalID
        slug
        saleMessage
        title
        realizedPrice
      }
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
      lotLabel
      sale {
        isAuction
        isClosed
        displayTimelyAt
      }
    }
  `,
})
