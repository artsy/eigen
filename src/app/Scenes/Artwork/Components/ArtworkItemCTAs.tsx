import {
  Flex,
  FollowArtistFillIcon,
  FollowArtistIcon,
  Join,
  NewFillHeartIcon,
  NewHeartIcon,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { ArtworkItemCTAs_artwork$key } from "__generated__/ArtworkItemCTAs_artwork.graphql"
import { useFollowArtist } from "app/Components/Artist/useFollowArtist"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ARTWORK_RAIL_CARD_CTA_ICON_SIZE } from "app/Components/constants"
import { useGetNewSaveAndFollowOnArtworkCardExperimentVariant } from "app/Scenes/Artwork/utils/useGetNewSaveAndFollowOnArtworkCardExperimentVariant"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import {
  ArtworkActionTrackingProps,
  tracks as artworkActionTracks,
} from "app/utils/track/ArtworkActions"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkItemCTAsProps extends ArtworkActionTrackingProps {
  artwork: ArtworkItemCTAs_artwork$key
  showSaveIcon?: boolean
  showFollowIcon?: boolean
}

export const ArtworkItemCTAs: React.FC<ArtworkItemCTAsProps> = ({
  artwork: artworkProp,
  showSaveIcon = false,
  /**
   * Show follow icon by default, but allow it to be hidden on specific grids
   */
  showFollowIcon = true,
  contextModule,
  contextScreen,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
}) => {
  const { trackEvent } = useTracking()
  const enableNewSaveAndFollowOnArtworkCard = useFeatureFlag(
    "AREnableNewSaveAndFollowOnArtworkCard"
  )

  const { enableNewSaveCTA, enableNewSaveAndFollowCTAs } =
    useGetNewSaveAndFollowOnArtworkCardExperimentVariant(
      "onyx_artwork-card-save-and-follow-cta-redesign"
    )

  const artwork = useFragment(artworkFragment, artworkProp)

  const {
    availability,
    isAcquireable,
    isBiddable,
    isInquireable,
    isOfferable,
    collectorSignals,
    sale,
    artist,
  } = artwork

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

  const { handleFollowToggle } = useFollowArtist({
    artist,
    showToast: true,
    contextModule,
    contextScreenOwnerType,
    ownerType: Schema.OwnerEntityTypes.Artwork,
  })

  if (!enableNewSaveAndFollowOnArtworkCard) {
    return null
  }

  const saveCTA = (
    <ArtworkItemCTAsWrapper onPress={saveArtworkToLists} testID="save-artwork">
      {isSaved ? (
        <NewFillHeartIcon
          testID="heart-icon-filled"
          height={ARTWORK_RAIL_CARD_CTA_ICON_SIZE}
          width={ARTWORK_RAIL_CARD_CTA_ICON_SIZE}
          fill="black100"
        />
      ) : (
        <NewHeartIcon
          testID="heart-icon-empty"
          height={ARTWORK_RAIL_CARD_CTA_ICON_SIZE}
          width={ARTWORK_RAIL_CARD_CTA_ICON_SIZE}
        />
      )}

      {!!sale?.isAuction && !!collectorSignals?.auction?.lotWatcherCount && (
        <Text lineHeight="12px" pl={0.5} variant="xxs" numberOfLines={1} textAlign="center">
          {collectorSignals.auction.lotWatcherCount}
        </Text>
      )}
    </ArtworkItemCTAsWrapper>
  )

  const followCTA = (
    <ArtworkItemCTAsWrapper onPress={handleFollowToggle} testID="follow-artist">
      {artist?.isFollowed ? (
        <FollowArtistFillIcon
          testID="follow-icon-filled"
          height={ARTWORK_RAIL_CARD_CTA_ICON_SIZE}
          width={ARTWORK_RAIL_CARD_CTA_ICON_SIZE}
          fill="black100"
        />
      ) : (
        <FollowArtistIcon
          testID="follow-icon-empty"
          height={ARTWORK_RAIL_CARD_CTA_ICON_SIZE}
          width={ARTWORK_RAIL_CARD_CTA_ICON_SIZE}
        />
      )}
    </ArtworkItemCTAsWrapper>
  )

  // do not render Save and Follow CTAs when showSaveIcon is false
  if (!showSaveIcon) return null

  if (enableNewSaveCTA) {
    return saveCTA
  } else if (enableNewSaveAndFollowCTAs) {
    return (
      <Flex flexDirection="row">
        <Join separator={<Spacer x={1} />}>
          {saveCTA}
          {!!showFollowIcon && followCTA}
        </Join>
      </Flex>
    )
  } else return null
}

const ArtworkItemCTAsWrapper: React.FC<{ onPress?: () => void; testID: string }> = ({
  onPress,
  testID,
  children,
}) => {
  return (
    <Touchable
      haptic
      onPress={onPress}
      testID={testID}
      style={{
        bottom: 0,
        left: 0,
        alignItems: "flex-start",
      }}
    >
      <Flex
        flexDirection="row"
        p={1}
        borderRadius={50}
        justifyContent="center"
        alignItems="center"
        backgroundColor="black5"
      >
        {children}
      </Flex>
    </Touchable>
  )
}

const artworkFragment = graphql`
  fragment ArtworkItemCTAs_artwork on Artwork {
    internalID
    availability
    isAcquireable
    isBiddable
    isInquireable
    isOfferable
    collectorSignals {
      auction {
        lotWatcherCount
      }
    }
    artist {
      isFollowed
      internalID
      ...useFollowArtist_artist
    }
    sale {
      isAuction
    }
    ...useSaveArtworkToArtworkLists_artwork
  }
`
