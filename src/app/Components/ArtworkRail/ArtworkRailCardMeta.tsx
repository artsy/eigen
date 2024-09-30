import { Box, Flex, HeartFillIcon, HeartIcon, Text, Touchable } from "@artsy/palette-mobile"
import { ArtworkRailCardMeta_artwork$key } from "__generated__/ArtworkRailCardMeta_artwork.graphql"
import { ArtworkAuctionTimer } from "app/Components/ArtworkGrids/ArtworkAuctionTimer"
import { ArtworkSocialSignal } from "app/Components/ArtworkGrids/ArtworkSocialSignal"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT } from "app/Components/ArtworkRail/ArtworkRailCard"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"
import { saleMessageOrBidInfo as defaultSaleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { getTimer } from "app/utils/getTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import {
  ArtworkActionTrackingProps,
  tracks as artworkActionTracks,
} from "app/utils/track/ArtworkActions"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

// These are the props that are shared between ArtworkRailCard and ArtworkRailCardMeta
export interface ArtworkRailCardCommonProps extends ArtworkActionTrackingProps {
  dark?: boolean
  hideArtistName?: boolean
  hideIncreasedInterestSignal?: boolean
  hideCuratorsPickSignal?: boolean
  lotLabel?: string | null
  metaContainerStyles?: {}
  showSaveIcon?: boolean
  showPartnerName?: boolean
  /**
   * Rendered instead of the sale price section if provided.
   */
  SalePriceComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
}

// These are the props that specific to ArtworkRailCardMeta
export interface ArtworkRailCardMetaProps extends ArtworkRailCardCommonProps {
  artwork: ArtworkRailCardMeta_artwork$key
  backgroundColor: "black100" | "white100"
}

export const ArtworkRailCardMeta: React.FC<ArtworkRailCardMetaProps> = ({
  artwork: artworkProp,
  backgroundColor,
  contextModule,
  contextScreen,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  dark = false,
  hideArtistName = false,
  hideCuratorsPickSignal = false,
  hideIncreasedInterestSignal = false,
  lotLabel,
  metaContainerStyles,
  SalePriceComponent,
  showPartnerName = false,
  showSaveIcon = false,
}) => {
  const { trackEvent } = useTracking()
  const enablePartnerOfferSignals = useFeatureFlag("AREnablePartnerOfferSignals")
  const enableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")
  const enableCuratorsPicksAndInterestSignals = useFeatureFlag(
    "AREnableCuratorsPicksAndInterestSignals"
  )

  const artwork = useFragment(artworkMetaFragment, artworkProp)

  const {
    artistNames,
    availability,
    date,
    isAcquireable,
    isBiddable,
    isInquireable,
    isOfferable,
    partner,
    title,
    sale,
    isUnlisted,
    collectorSignals,
  } = artwork

  const saleMessage = defaultSaleMessageOrBidInfo({
    artwork,
    isSmallTile: true,
    collectorSignals: enablePartnerOfferSignals ? collectorSignals : null,
    auctionSignals: enableAuctionImprovementsSignals ? collectorSignals?.auction : null,
  })

  const partnerOfferEndAt = collectorSignals?.partnerOffer?.endAt
    ? formattedTimeLeft(getTimer(collectorSignals.partnerOffer.endAt).time).timerCopy
    : ""

  const primaryTextColor = dark ? "white100" : "black100"
  const secondaryTextColor = dark ? "black15" : "black60"

  const displayLimitedTimeOfferSignal =
    enablePartnerOfferSignals && collectorSignals?.partnerOffer?.isAvailable && !sale?.isAuction

  const displayAuctionSignal = enableAuctionImprovementsSignals && sale?.isAuction

  const saleInfoTextColor =
    displayAuctionSignal && collectorSignals?.auction?.liveBiddingStarted
      ? "blue100"
      : primaryTextColor

  const saleInfoTextWeight =
    displayAuctionSignal && collectorSignals?.auction?.liveBiddingStarted ? "normal" : "bold"

  const onArtworkSavedOrUnSaved = (saved: boolean) => {
    trackEvent(
      artworkActionTracks.saveOrUnsaveArtwork(saved, {
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
      })
    )
  }

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artwork,
    onCompleted: onArtworkSavedOrUnSaved,
  })

  return (
    <Flex
      my={1}
      style={{
        height: ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT,
        ...metaContainerStyles,
      }}
      backgroundColor={backgroundColor}
      flexDirection="row"
      justifyContent="space-between"
    >
      <Flex flex={1} backgroundColor={backgroundColor}>
        {!!displayLimitedTimeOfferSignal && (
          <Box backgroundColor="blue10" px={0.5} alignSelf="flex-start" borderRadius={3}>
            <Text lineHeight="20px" variant="xs" color="blue100">
              Limited-Time Offer
            </Text>
          </Box>
        )}

        {!sale?.isAuction &&
          !displayLimitedTimeOfferSignal &&
          !!collectorSignals &&
          !!enableCuratorsPicksAndInterestSignals && (
            <ArtworkSocialSignal
              collectorSignals={collectorSignals}
              hideCuratorsPick={hideCuratorsPickSignal}
              hideIncreasedInterest={hideIncreasedInterestSignal}
              dark={dark}
            />
          )}

        {!!lotLabel && (
          <Text lineHeight="20px" color={secondaryTextColor} numberOfLines={1}>
            Lot {lotLabel}
          </Text>
        )}

        {!hideArtistName && !!artistNames && (
          <Text color={primaryTextColor} numberOfLines={1} lineHeight="20px" variant="xs">
            {artistNames}
          </Text>
        )}

        {!!title && (
          <Text
            lineHeight="20px"
            color={secondaryTextColor}
            numberOfLines={1}
            variant="xs"
            fontStyle="italic"
          >
            {title}
            {!!date && (
              <Text lineHeight="20px" color={secondaryTextColor} numberOfLines={1} variant="xs">
                {title && date ? ", " : ""}
                {date}
              </Text>
            )}
          </Text>
        )}

        {!!showPartnerName && !!partner?.name && (
          <Text lineHeight="20px" variant="xs" color={secondaryTextColor} numberOfLines={1}>
            {partner?.name}
          </Text>
        )}

        {SalePriceComponent
          ? SalePriceComponent
          : !!saleMessage && (
              <Text
                lineHeight="20px"
                variant="xs"
                color={saleInfoTextColor}
                numberOfLines={1}
                fontWeight={saleInfoTextWeight}
              >
                {saleMessage}

                {!!displayLimitedTimeOfferSignal && (
                  <Text
                    lineHeight="20px"
                    variant="xs"
                    fontWeight="normal"
                    color="blue100"
                    numberOfLines={1}
                  >
                    {"  "}
                    Exp. {partnerOfferEndAt}
                  </Text>
                )}
              </Text>
            )}

        {!!isUnlisted && (
          <Text
            lineHeight="20px"
            variant="xs"
            color={primaryTextColor}
            numberOfLines={1}
            fontWeight="bold"
          >
            Exclusive Access
          </Text>
        )}

        {!!displayAuctionSignal && !!collectorSignals && (
          <ArtworkAuctionTimer collectorSignals={collectorSignals} inRailCard />
        )}
      </Flex>

      {!!showSaveIcon && (
        <Flex flexDirection="row" alignItems="flex-start">
          {!!displayAuctionSignal && !!collectorSignals?.auction?.lotWatcherCount && (
            <Text lineHeight="20px" variant="xs" numberOfLines={1}>
              {collectorSignals.auction.lotWatcherCount}
            </Text>
          )}

          <Touchable
            haptic
            hitSlop={{ bottom: 5, right: 5, left: 5, top: 5 }}
            onPress={saveArtworkToLists}
            testID="save-artwork-icon"
            underlayColor={backgroundColor}
          >
            {isSaved ? (
              <HeartFillIcon
                testID="filled-heart-icon"
                height={HEART_ICON_SIZE}
                width={HEART_ICON_SIZE}
                fill="blue100"
              />
            ) : (
              <HeartIcon
                testID="empty-heart-icon"
                height={HEART_ICON_SIZE}
                width={HEART_ICON_SIZE}
                fill={primaryTextColor}
              />
            )}
          </Touchable>
        </Flex>
      )}
    </Flex>
  )
}

const artworkMetaFragment = graphql`
  fragment ArtworkRailCardMeta_artwork on Artwork {
    internalID
    availability
    slug
    isAcquireable
    isBiddable
    isInquireable
    isOfferable
    artistNames
    date
    isUnlisted
    realizedPrice
    sale {
      isAuction
      isClosed
      endAt
    }
    saleMessage
    saleArtwork {
      currentBid {
        display
      }
      counts {
        bidderPositions
      }
    }
    partner {
      name
    }
    title
    collectorSignals {
      primaryLabel
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
        lotClosesAt
      }

      ...ArtworkAuctionTimer_collectorSignals
      ...ArtworkSocialSignal_collectorSignals
    }

    ...useSaveArtworkToArtworkLists_artwork
  }
`
