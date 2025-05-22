import {
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  tappedEntityGroup,
  TappedEntityGroupArgs,
} from "@artsy/cohesion"
import { Box, DEFAULT_ACTIVE_OPACITY, Flex, Image, Text, useColor } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { SaleArtworkTileRailCard_saleArtwork$data } from "__generated__/SaleArtworkTileRailCard_saleArtwork.graphql"
import { CARD_WIDTH } from "app/Components/CardRail/CardRailCard"
import { UrgencyInfo } from "app/Components/SaleArtworkTileRailCard/UrgencyInfo"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { saleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

export const CONTAINER_HEIGHT = 120

const SaleArtworkCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.mono0"),
  activeOpacity: DEFAULT_ACTIVE_OPACITY,
}))``

export interface SaleArtworkTileRailCardProps {
  onPress: () => void
  saleArtwork: SaleArtworkTileRailCard_saleArtwork$data
  useCustomSaleMessage?: boolean
  useSquareAspectRatio?: boolean
  contextScreenOwnerType?: ScreenOwnerType
  cardSize?: "small" | "large"
  refreshRail?: () => void
}

export const SaleArtworkTileRailCard: React.FC<SaleArtworkTileRailCardProps> = ({
  onPress,
  saleArtwork,
  useCustomSaleMessage = false,
  useSquareAspectRatio = false,
  contextScreenOwnerType,
  cardSize = "small",
  refreshRail,
}) => {
  const enableNewSaleArtworkTileRailCard =
    useFeatureFlag("AREnableNewAuctionsRailCard") && cardSize === "large"
  const color = useColor()
  const tracking = useTracking()
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  const artwork = saleArtwork?.artwork

  if (!artwork) {
    return null
  }

  const extendedBiddingEndAt = saleArtwork?.extendedBiddingEndAt
  const lotEndAt = saleArtwork?.endAt
  const endAt = extendedBiddingEndAt ?? lotEndAt ?? saleArtwork.sale?.endAt ?? ""
  const startAt = saleArtwork.sale?.liveStartAt ?? saleArtwork.sale?.startAt ?? ""

  const handleTap = () => {
    if (contextScreenOwnerType) {
      const trackingArgs: TappedEntityGroupArgs = {
        contextModule: ContextModule.auctionRail,
        contextScreenOwnerType: OwnerType.sale,
        contextScreenOwnerId: artwork?.internalID,
        contextScreenOwnerSlug: artwork?.slug,
        destinationScreenOwnerType: OwnerType.artwork,
        type: "thumbnail",
      }

      tracking.trackEvent(tappedEntityGroup(trackingArgs))
    }
    onPress()
  }

  if (!!artwork?.image?.imageURL && !artwork.image?.aspectRatio && !useSquareAspectRatio) {
    throw new Error("imageAspectRatio is required for non-square images")
  }

  const IMAGE_CONTAINER_WIDTH = enableNewSaleArtworkTileRailCard ? CARD_WIDTH : CONTAINER_HEIGHT

  const imageWidth = useSquareAspectRatio
    ? IMAGE_CONTAINER_WIDTH
    : (artwork?.image?.aspectRatio ?? 1) * CONTAINER_HEIGHT

  const imageDisplay = artwork?.image?.imageURL ? (
    <Flex px={0.5} pb={0.5} justifyContent="flex-end" overflow="hidden" borderRadius={2}>
      <Image
        testID="sale-artwork-image"
        src={artwork.image.imageURL}
        width={imageWidth}
        height={IMAGE_CONTAINER_WIDTH}
        blurhash={showBlurhash ? artwork.image.blurhash : undefined}
      />
    </Flex>
  ) : (
    <Box
      bg={color("mono30")}
      width={IMAGE_CONTAINER_WIDTH}
      height={IMAGE_CONTAINER_WIDTH}
      style={{ borderRadius: 2 }}
    />
  )

  const artistNamesDisplay = artwork.artistNames ? (
    <Text
      color="mono60"
      lineHeight="20px"
      numberOfLines={1}
      variant={enableNewSaleArtworkTileRailCard ? "xs" : "sm"}
    >
      {artwork.artistNames}
    </Text>
  ) : null

  const saleMessageDisplay = artwork.saleMessage ? (
    <Text variant="xs" lineHeight="20px" numberOfLines={1}>
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
    isSmallTile: !enableNewSaleArtworkTileRailCard,
  })

  const customSaleMessageDisplay = useCustomSaleMessage ? (
    <Text variant="xs" lineHeight="20px" numberOfLines={1}>
      {customSaleMessage}
    </Text>
  ) : null

  const titleAndDateDisplay =
    artwork.title || artwork.date ? (
      <Text
        color="mono60"
        lineHeight="20px"
        numberOfLines={1}
        variant={enableNewSaleArtworkTileRailCard ? "xs" : "sm"}
        italic={!!enableNewSaleArtworkTileRailCard}
      >
        {[artwork.title, artwork.date].filter(Boolean).join(", ")}
      </Text>
    ) : null

  const lotNumber = saleArtwork.lotLabel ? (
    <Text
      numberOfLines={1}
      lineHeight="20px"
      variant={enableNewSaleArtworkTileRailCard ? "xs" : "sm"}
    >
      Lot {saleArtwork.lotLabel}
    </Text>
  ) : null

  return (
    <AnalyticsContextProvider
      contextScreenOwnerId={artwork.internalID}
      contextScreenOwnerSlug={artwork.slug}
      contextScreenOwnerType={OwnerType.sale}
    >
      <SaleArtworkCard onPress={handleTap}>
        <Flex>
          {imageDisplay}
          <Box mt={1} width={IMAGE_CONTAINER_WIDTH}>
            {lotNumber}
            {artistNamesDisplay}
            {titleAndDateDisplay}
            {customSaleMessage ? customSaleMessageDisplay : saleMessageDisplay}
            {!!enableNewSaleArtworkTileRailCard && (
              <UrgencyInfo
                startAt={startAt}
                endAt={endAt}
                isLiveAuction={!!saleArtwork.sale?.liveStartAt}
                saleTimeZone={saleArtwork.sale?.timeZone ?? ""}
                onTimerEnd={refreshRail}
              />
            )}
          </Box>
        </Flex>
      </SaleArtworkCard>
    </AnalyticsContextProvider>
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
          imageURL: url(version: ["large"])
          aspectRatio
          blurhash
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
      endAt
      extendedBiddingEndAt
      lotLabel
      sale {
        internalID
        isAuction
        isClosed
        displayTimelyAt
        cascadingEndTimeIntervalMinutes
        startAt
        endAt
        liveStartAt
        timeZone
      }
    }
  `,
})
