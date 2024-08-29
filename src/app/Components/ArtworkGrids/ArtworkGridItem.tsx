import { ActionType, ContextModule, OwnerType, TappedMainArtworkGrid } from "@artsy/cohesion"
import {
  Box,
  Flex,
  HeartFillIcon,
  HeartIcon,
  Image,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
  TextProps,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { filterArtworksParams } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworkAuctionTimer } from "app/Components/ArtworkGrids/ArtworkAuctionTimer"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ContextMenuArtwork } from "app/Components/ContextMenu/ContextMenuArtwork"
import { DurationProvider } from "app/Components/Countdown"
import { Disappearable, DissapearableArtwork } from "app/Components/Disappearable"
import { ProgressiveOnboardingSaveArtwork } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSaveArtwork"
import { PartnerOffer } from "app/Scenes/Activity/components/NotificationArtworkList"
import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useArtworkBidding } from "app/utils/Websockets/auctions/useArtworkBidding"
import { getTimer } from "app/utils/getTimer"
import { getUrgencyTag } from "app/utils/getUrgencyTag"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { RandomNumberGenerator } from "app/utils/placeholders"
import {
  ArtworkActionTrackingProps,
  tracks as artworkActionTracks,
} from "app/utils/track/ArtworkActions"
import { DateTime } from "luxon"
import React, { useRef, useState } from "react"
import { View, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { LotCloseInfo } from "./LotCloseInfo"
import { LotProgressBar } from "./LotProgressBar"

const ICON_SIZE = 22

export type PriceOfferMessage = { priceListedMessage: string; priceWithDiscountMessage: string }
export interface ArtworkProps extends ArtworkActionTrackingProps {
  /** styles for each field: allows for customization of each field */
  artistNamesTextStyle?: TextProps
  artwork: ArtworkGridItem_artwork$data
  artworkMetaStyle?: ViewProps["style"]
  disableArtworksListPrompt?: boolean
  /** Hide sale info */
  height?: number
  /** Hide partner name */
  hidePartner?: boolean
  hideSaleInfo?: boolean
  hideSaveIcon?: boolean
  /** Hide urgency tags (3 Days left, 1 hour left) */
  hideUrgencyTags?: boolean
  /** Pass Tap to override generic ing, used for home tracking in rails */
  itemIndex?: number
  lotLabelTextStyle?: TextProps
  /** Overrides onPress and prevents the default behaviour. */
  onPress?: (artworkID: string, artwork?: ArtworkGridItem_artwork$data) => void
  partnerNameTextStyle?: TextProps
  partnerOffer?: PartnerOffer
  priceOfferMessage?: PriceOfferMessage
  saleInfoTextStyle?: TextProps
  /** Show the lot number (Lot 213) */
  showLotLabel?: boolean
  titleTextStyle?: TextProps
  trackTap?: (artworkSlug: string, index?: number) => void
  trackingFlow?: string
  /** allows for artwork to be added to recent searches */
  updateRecentSearchesOnTap?: boolean
  urgencyTagTextStyle?: TextProps
}

export const Artwork: React.FC<ArtworkProps> = ({
  artistNamesTextStyle,
  artwork,
  artworkMetaStyle,
  contextModule,
  contextScreen,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  contextScreenQuery,
  disableArtworksListPrompt = false,
  height,
  hidePartner = false,
  hideSaleInfo = false,
  hideSaveIcon = false,
  hideUrgencyTags = false,
  itemIndex,
  lotLabelTextStyle,
  onPress,
  partnerNameTextStyle,
  partnerOffer,
  priceOfferMessage,
  saleInfoTextStyle,
  showLotLabel = false,
  titleTextStyle,
  trackTap,
  updateRecentSearchesOnTap = false,
  urgencyTagTextStyle,
}) => {
  const itemRef = useRef<any>()
  const color = useColor()
  const tracking = useTracking()
  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")
  const AREnablePartnerOfferSignals = useFeatureFlag("AREnablePartnerOfferSignals")
  const AREnableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")

  let filterParams: any = undefined

  // This is needed to make sure the filter context is defined
  if (ArtworksFiltersStore.useStore()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
    filterParams = filterArtworksParams(appliedFilters)
  }

  const extendedBiddingEndAt = artwork.saleArtwork?.extendedBiddingEndAt
  const lotEndAt = artwork.saleArtwork?.endAt
  const biddingEndAt = extendedBiddingEndAt ?? lotEndAt
  const lotID = artwork.saleArtwork?.lotID
  const collectorSignals = artwork.collectorSignals
  const isAuction = artwork.sale?.isAuction

  const { currentBiddingEndAt, lotSaleExtended } = useArtworkBidding({
    lotID,
    lotEndAt,
    biddingEndAt,
  })

  const addArtworkToRecentSearches = () => {
    if (updateRecentSearchesOnTap) {
      GlobalStore.actions.search.addRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          imageUrl: artwork?.image?.url ?? null,
          href: artwork.href,
          slug: artwork.slug,
          displayLabel: `${artwork.artistNames}, ${artwork.title} (${artwork.date})`,
          __typename: "Artwork",
          displayType: "Artwork",
        },
      })
    }
  }

  const onArtworkSavedOrUnSaved = (saved: boolean) => {
    const { availability, isAcquireable, isBiddable, isInquireable, isOfferable } = artwork
    const params = {
      acquireable: isAcquireable,
      availability,
      biddable: isBiddable,
      context_module: contextModule,
      context_screen: contextScreen,
      context_screen_owner_id: contextScreenOwnerId,
      context_screen_owner_slug: contextScreenOwnerSlug,
      context_screen_owner_type: contextScreenOwnerType,
      inquireable: isInquireable,
      offerable: isOfferable,
    }
    tracking.trackEvent(artworkActionTracks.saveOrUnsaveArtwork(saved, params))
  }

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artwork,
    onCompleted: onArtworkSavedOrUnSaved,
  })

  const handleArtworkSave = useSaveArtwork({
    id: artwork.id,
    internalID: artwork.internalID,
    isSaved: !!artwork.isSaved,
    onCompleted: onArtworkSavedOrUnSaved,
  })

  const { hasEnded } = getTimer(partnerOffer?.endAt || "")
  const enablePartnerOfferOnArtworkScreen = useFeatureFlag("AREnablePartnerOfferOnArtworkScreen")

  const handleTap = () => {
    if (onPress) {
      return onPress(artwork.slug, artwork)
    }

    addArtworkToRecentSearches()
    trackArtworkTap()

    if (artwork.href) {
      if (partnerOffer && !!hasEnded && !!enablePartnerOfferOnArtworkScreen) {
        navigate?.(artwork.href, { passProps: { artworkOfferExpired: true } })
      } else {
        navigate?.(artwork.href)
      }
    }
  }

  const trackArtworkTap = () => {
    // Unless you explicitly pass in a tracking function or provide a contextScreenOwnerType, we won't track
    // taps from the grid.
    if (trackTap) {
      trackTap(artwork.slug, itemIndex)
    } else if (contextScreenOwnerType) {
      const genericTapEvent: TappedMainArtworkGrid = {
        action: ActionType.tappedMainArtworkGrid,
        context_module: ContextModule.artworkGrid,
        context_screen: contextScreen,
        context_screen_owner_type: contextScreenOwnerType,
        context_screen_owner_id: contextScreenOwnerId,
        context_screen_owner_slug: contextScreenOwnerSlug,
        destination_screen_owner_type: OwnerType.artwork,
        destination_screen_owner_id: artwork.internalID,
        destination_screen_owner_slug: artwork.slug,
        position: itemIndex,
        query: contextScreenQuery,
        sort: filterParams?.sort,
        type: "thumbnail",
      }

      if (AREnablePartnerOfferSignals && collectorSignals?.partnerOffer?.isAvailable) {
        genericTapEvent.signal_label = "Limited-Time Offer"
      }

      tracking.trackEvent(genericTapEvent)
    }
  }

  const saleInfo = saleMessageOrBidInfo({
    artwork,
    collectorSignals: AREnablePartnerOfferSignals ? collectorSignals : null,
    auctionSignals: AREnableAuctionImprovementsSignals ? collectorSignals?.auction : null,
  })

  const endsAt = artwork.sale?.cascadingEndTimeIntervalMinutes
    ? currentBiddingEndAt
    : artwork.saleArtwork?.endAt || artwork.sale?.endAt

  const partnerOfferEndAt = collectorSignals?.partnerOffer?.endAt
    ? formattedTimeLeft(getTimer(collectorSignals.partnerOffer.endAt).time).timerCopy
    : ""

  const urgencyTag = getUrgencyTag(endsAt)

  const canShowAuctionProgressBar =
    !!artwork.sale?.extendedBiddingPeriodMinutes && !!artwork.sale?.extendedBiddingIntervalMinutes

  const displayPriceOfferMessage =
    !!priceOfferMessage &&
    !!priceOfferMessage.priceListedMessage &&
    !!priceOfferMessage.priceWithDiscountMessage

  const displayLimitedTimeOfferSignal =
    AREnablePartnerOfferSignals &&
    collectorSignals?.partnerOffer?.isAvailable &&
    !isAuction &&
    !displayPriceOfferMessage

  const displayAuctionSignal = AREnableAuctionImprovementsSignals && isAuction

  const saleInfoTextColor =
    displayAuctionSignal && collectorSignals?.auction?.liveBiddingStarted ? "blue100" : "black100"

  const handleSupress = async (item: DissapearableArtwork) => {
    await item._disappearable?.disappear()
  }

  return (
    <Disappearable ref={(ref) => ((artwork as any)._disappearable = ref)}>
      <ContextMenuArtwork
        onSupressArtwork={() => handleSupress(artwork as any)}
        contextModule={contextModule}
        contextScreenOwnerType={contextScreenOwnerType}
        onCreateAlertActionPress={() => setShowCreateArtworkAlertModal(true)}
        artwork={artwork}
      >
        <Touchable
          haptic
          underlayColor={color("white100")}
          activeOpacity={0.8}
          onPress={handleTap}
          testID={`artworkGridItem-${artwork.title}`}
        >
          <View ref={itemRef}>
            {!!artwork.image?.url && (
              <View>
                <Image
                  src={artwork.image.url}
                  aspectRatio={artwork.image.aspectRatio ?? 1}
                  height={height}
                  width={Number(height) * (artwork.image.aspectRatio ?? 1)}
                  blurhash={showBlurhash ? artwork.image.blurhash : undefined}
                  resizeMode="contain"
                />

                {Boolean(
                  !hideUrgencyTags &&
                    urgencyTag &&
                    isAuction &&
                    !artwork?.sale?.isClosed &&
                    !displayAuctionSignal
                ) && (
                  <Flex
                    position="absolute"
                    bottom="5px"
                    left="5px"
                    backgroundColor="white"
                    px="5px"
                    py="3px"
                    borderRadius={2}
                    alignSelf="flex-start"
                  >
                    <Text variant="xs" color="black100" numberOfLines={1} {...urgencyTagTextStyle}>
                      {urgencyTag}
                    </Text>
                  </Flex>
                )}
              </View>
            )}
            {!!canShowAuctionProgressBar && (
              <Box mt={1}>
                <DurationProvider startAt={endsAt ?? undefined}>
                  <LotProgressBar
                    duration={null}
                    startAt={artwork.sale?.startAt}
                    extendedBiddingPeriodMinutes={artwork.sale.extendedBiddingPeriodMinutes}
                    extendedBiddingIntervalMinutes={artwork.sale.extendedBiddingIntervalMinutes}
                    biddingEndAt={endsAt}
                    hasBeenExtended={lotSaleExtended}
                  />
                </DurationProvider>
              </Box>
            )}
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              mt={1}
              style={artworkMetaStyle}
            >
              <Flex flex={1}>
                {!!displayLimitedTimeOfferSignal && (
                  <Box backgroundColor="blue10" px={0.5} alignSelf="flex-start" borderRadius={3}>
                    <Text lineHeight="20px" variant="xs" color="blue100">
                      Limited-Time Offer
                    </Text>
                  </Box>
                )}
                {!!showLotLabel && !!artwork.saleArtwork?.lotLabel && (
                  <>
                    <Text variant="xs" numberOfLines={1} caps {...lotLabelTextStyle}>
                      Lot {artwork.saleArtwork.lotLabel}
                    </Text>
                    {!!artwork.sale?.cascadingEndTimeIntervalMinutes && !displayAuctionSignal && (
                      <DurationProvider startAt={endsAt ?? undefined}>
                        <LotCloseInfo
                          duration={null}
                          saleArtwork={artwork.saleArtwork}
                          sale={artwork.sale}
                          lotEndAt={endsAt ?? undefined}
                          hasBeenExtended={lotSaleExtended}
                        />
                      </DurationProvider>
                    )}
                  </>
                )}
                {!!artwork.artistNames && (
                  <Text
                    lineHeight="18px"
                    weight="regular"
                    variant="xs"
                    numberOfLines={1}
                    {...artistNamesTextStyle}
                  >
                    {artwork.artistNames}
                  </Text>
                )}
                {!!artwork.title && (
                  <Text
                    lineHeight="18px"
                    variant="xs"
                    weight="regular"
                    color="black60"
                    numberOfLines={1}
                    {...titleTextStyle}
                  >
                    <Text lineHeight="18px" variant="xs" weight="regular" italic>
                      {artwork.title}
                    </Text>
                    {artwork.date ? `, ${artwork.date}` : ""}
                  </Text>
                )}
                {!hidePartner && !!artwork.partner?.name && (
                  <Text
                    variant="xs"
                    lineHeight="18px"
                    color="black60"
                    numberOfLines={1}
                    {...partnerNameTextStyle}
                  >
                    {artwork.partner.name}
                  </Text>
                )}
                {!!displayPriceOfferMessage && (
                  <Flex flexDirection="row">
                    <Text lineHeight="20px" variant="xs" numberOfLines={1} fontWeight="bold">
                      {priceOfferMessage.priceWithDiscountMessage}
                    </Text>
                    <Text color="black60" variant="xs">
                      {" "}
                      (List price: {priceOfferMessage.priceListedMessage})
                    </Text>
                  </Flex>
                )}
                {!!saleInfo && !hideSaleInfo && !displayPriceOfferMessage && (
                  <Text
                    lineHeight="18px"
                    variant="xs"
                    weight="medium"
                    numberOfLines={1}
                    color={saleInfoTextColor}
                    {...saleInfoTextStyle}
                  >
                    {saleInfo}
                    {!!displayLimitedTimeOfferSignal && (
                      <Text
                        lineHeight="18px"
                        variant="xs"
                        weight="regular"
                        numberOfLines={1}
                        color="blue100"
                        {...saleInfoTextStyle}
                      >
                        {"  "}
                        Exp. {partnerOfferEndAt}
                      </Text>
                    )}
                  </Text>
                )}

                {!!artwork.isUnlisted && (
                  <Text lineHeight="18px" variant="xs" numberOfLines={1} fontWeight="bold">
                    Exclusive Access
                  </Text>
                )}

                {!!displayAuctionSignal && !!collectorSignals && (
                  <ArtworkAuctionTimer collectorSignals={collectorSignals} />
                )}
              </Flex>
              {!hideSaveIcon && (
                <Flex flexDirection="row" alignItems="flex-start">
                  {!!displayAuctionSignal && !!collectorSignals?.auction?.lotWatcherCount && (
                    <Text lineHeight="18px" variant="xs" numberOfLines={1}>
                      {collectorSignals.auction.lotWatcherCount}
                    </Text>
                  )}
                  <Touchable
                    haptic
                    onPress={disableArtworksListPrompt ? handleArtworkSave : saveArtworkToLists}
                    testID="save-artwork-icon"
                  >
                    <ArtworkHeartIcon isSaved={!!isSaved} index={itemIndex} />
                  </Touchable>
                </Flex>
              )}
            </Flex>
          </View>
        </Touchable>
      </ContextMenuArtwork>

      <CreateArtworkAlertModal
        artwork={artwork}
        onClose={() => setShowCreateArtworkAlertModal(false)}
        visible={showCreateArtworkAlertModal}
      />
    </Disappearable>
  )
}

const ArtworkHeartIcon: React.FC<{ isSaved: boolean | null; index?: number }> = ({
  isSaved,
  index,
}) => {
  const iconProps = { height: ICON_SIZE, width: ICON_SIZE, testID: "empty-heart-icon" }

  if (isSaved) {
    return <HeartFillIcon {...iconProps} testID="filled-heart-icon" fill="blue100" />
  }
  if (index === 0) {
    // We only try to show the save onboard Popover in the 1st element
    return (
      <ProgressiveOnboardingSaveArtwork>
        <HeartIcon {...iconProps} />
      </ProgressiveOnboardingSaveArtwork>
    )
  }
  return <HeartIcon {...iconProps} />
}

/**
 * Get sale message or bid info
 * @example
 * "$1,000 (Starting price)"
 * @example
 * "Bidding closed"
 *  @example
 * "$1,750 (2 bids)"
 */
export const saleMessageOrBidInfo = ({
  artwork,
  isSmallTile = false,
  collectorSignals,
  auctionSignals,
}: {
  artwork: Readonly<{
    sale:
      | { isAuction: boolean | null | undefined; isClosed: boolean | null | undefined }
      | null
      | undefined
    saleArtwork:
      | {
          counts: { bidderPositions: number | null | undefined } | null | undefined
          currentBid: { display: string | null | undefined } | null | undefined
        }
      | null
      | undefined
    saleMessage: string | null | undefined
    realizedPrice: string | null | undefined
  }>
  isSmallTile?: boolean
  collectorSignals?: Readonly<{
    partnerOffer:
      | {
          isAvailable: boolean | null | undefined
          priceWithDiscount: { display: string | null | undefined } | null | undefined
          endAt: string | null | undefined
        }
      | null
      | undefined
  }> | null
  auctionSignals?: Readonly<{
    liveBiddingStarted: boolean
    liveStartAt: string | null | undefined
    lotClosesAt: string | null | undefined
    bidCount: number
  }> | null
}): string | null | undefined => {
  const { sale, saleArtwork, realizedPrice } = artwork

  // Price which an artwork was sold for.
  if (realizedPrice) {
    return `Sold for ${realizedPrice}`
  }

  // Auction specs are available at https://artsyproduct.atlassian.net/browse/MX-482
  // The auction is open
  if (sale?.isAuction && !sale.isClosed) {
    const bidderPositions = saleArtwork?.counts?.bidderPositions
    const currentBid = saleArtwork?.currentBid?.display

    if (!!auctionSignals) {
      const lotEndAt = DateTime.fromISO(auctionSignals.lotClosesAt ?? "")
      const bidCount = auctionSignals.bidCount

      if (lotEndAt.diffNow().as("seconds") <= 0) {
        return "Bidding closed"
      }

      if (auctionSignals.liveBiddingStarted) {
        return "Bidding live now"
      }

      if (!!bidCount) {
        return `${currentBid} (${bidCount} bid${bidCount > 1 ? "s" : ""})`
      }

      return currentBid
    }

    // If there are no current bids we show the starting price with an indication that it's a new bid
    if (!bidderPositions) {
      if (isSmallTile) {
        return `${currentBid} (Bid)`
      }
      return `${currentBid} (Starting bid)`
    }

    // If there are bids we show the current bid price and the number of bids
    const numberOfBidsString = bidderPositions === 1 ? "1 bid" : `${bidderPositions} bids`
    return `${currentBid} (${numberOfBidsString})`
  }

  if (collectorSignals?.partnerOffer?.isAvailable) {
    return collectorSignals.partnerOffer.priceWithDiscount?.display
  }

  return artwork.saleMessage
}

export default createFragmentContainer(Artwork, {
  artwork: graphql`
    fragment ArtworkGridItem_artwork on Artwork
    @argumentDefinitions(
      includeAllImages: { type: "Boolean", defaultValue: false }
      width: { type: "Int" }
    ) {
      ...CreateArtworkAlertModal_artwork
      availability
      title
      date
      saleMessage
      slug
      artists(shallow: true) {
        name
      }
      widthCm
      heightCm
      isHangable
      id
      internalID
      isAcquireable
      isBiddable
      isInquireable
      isOfferable
      isSaved
      isUnlisted
      artistNames
      href
      sale {
        isAuction
        isClosed
        displayTimelyAt
        cascadingEndTimeIntervalMinutes
        extendedBiddingPeriodMinutes
        extendedBiddingIntervalMinutes
        endAt
        startAt
      }
      saleArtwork {
        counts {
          bidderPositions
        }
        formattedEndDateTime
        currentBid {
          display
        }
        lotID
        lotLabel
        endAt
        extendedBiddingEndAt
      }
      partner {
        name
      }
      image(includeAll: $includeAllImages) {
        blurhash
        url(version: "large")
        aspectRatio
        resized(width: $width) {
          src
          srcSet
          width
          height
        }
      }
      realizedPrice
      collectorSignals {
        partnerOffer {
          isAvailable
          endAt
          priceWithDiscount {
            display
          }
        }
        auction {
          lotWatcherCount
          bidCount
          liveBiddingStarted
          liveStartAt
          onlineBiddingExtended
          registrationEndsAt
          lotClosesAt
        }
        ...ArtworkAuctionTimer_collectorSignals
      }
      ...useSaveArtworkToArtworkLists_artwork
    }
  `,
})

export const ArtworkGridItemPlaceholder: React.FC<{ seed?: number }> = ({
  seed = Math.random(),
}) => {
  const rng = new RandomNumberGenerator(seed)

  return (
    <Skeleton>
      <SkeletonBox height={rng.next({ from: 50, to: 150 })} width="100%" />
      <Spacer y={1} />
      <SkeletonText variant="xs">Artwork Title</SkeletonText>
      <SkeletonText variant="xs" mt={0.5}>
        Artwork Description
      </SkeletonText>
    </Skeleton>
  )
}
