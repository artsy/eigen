import { Flex, HeartFillIcon, HeartIcon, Text, Touchable } from "@artsy/palette-mobile"
import { ArtworkRailCardMeta_artwork$key } from "__generated__/ArtworkRailCardMeta_artwork.graphql"
import { ArtworkAuctionTimer } from "app/Components/ArtworkGrids/ArtworkAuctionTimer"
import { ArtworkSocialSignal } from "app/Components/ArtworkGrids/ArtworkSocialSignal"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT } from "app/Components/ArtworkRail/ArtworkRailCard"
import { useMetaDataTextColor } from "app/Components/ArtworkRail/ArtworkRailUtils"
import { ArtworkSaleMessage } from "app/Components/ArtworkRail/ArtworkSaleMessage"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { saleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
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
  const enableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")

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

  const saleMessage = saleMessageOrBidInfo({
    artwork,
    isSmallTile: true,
    collectorSignals: collectorSignals,
    auctionSignals: enableAuctionImprovementsSignals ? collectorSignals?.auction : null,
  })

  const { primaryTextColor, secondaryTextColor } = useMetaDataTextColor({ dark })

  const displayLimitedTimeOfferSignal =
    collectorSignals?.partnerOffer?.isAvailable && !sale?.isAuction

  const displayAuctionSignal = enableAuctionImprovementsSignals && sale?.isAuction

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

  const displayArtworkSocialSignal =
    !sale?.isAuction && !displayLimitedTimeOfferSignal && !!collectorSignals

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
              <ArtworkSaleMessage
                artwork={artwork}
                saleMessage={saleMessage}
                displayLimitedTimeOfferSignal={displayLimitedTimeOfferSignal}
                dark={dark}
              />
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

        {!!displayArtworkSocialSignal && (
          <ArtworkSocialSignal
            collectorSignals={collectorSignals}
            hideCuratorsPick={hideCuratorsPickSignal}
            hideIncreasedInterest={hideIncreasedInterestSignal}
            dark={dark}
          />
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
    }
    saleArtwork {
      currentBid {
        display
      }
      counts {
        bidderPositions
      }
    }
    saleMessage
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

    ...ArtworkSaleMessage_artwork
    ...useSaveArtworkToArtworkLists_artwork
  }
`
