import {
  Flex,
  Icon,
  IconProps,
  Join,
  Path,
  Spacer,
  Text,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { ArtworkItemCTAs_artwork$key } from "__generated__/ArtworkItemCTAs_artwork.graphql"
import { useFollowArtist } from "app/Components/Artist/useFollowArtist"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ARTWORK_RAIL_CARD_CTA_ICON_SIZE } from "app/Components/constants"
import { useExperimentVariant } from "app/utils/experiments/hooks"
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
}

export const ArtworkItemCTAs: React.FC<ArtworkItemCTAsProps> = ({
  artwork: artworkProp,
  showSaveIcon = false,
  contextModule,
  contextScreen,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
}) => {
  const { trackEvent } = useTracking()
  const enableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")
  const newSaveAndFollowOnArtworkCardExperiment = useExperimentVariant(
    "onyx_artwork-card-save-and-follow-cta-redesign"
  )

  const enableNewSaveCTA =
    newSaveAndFollowOnArtworkCardExperiment.enabled &&
    newSaveAndFollowOnArtworkCardExperiment.payload === "variant-b"
  const enableNewSaveAndFollowCTAs =
    newSaveAndFollowOnArtworkCardExperiment.enabled &&
    newSaveAndFollowOnArtworkCardExperiment.payload === "variant-c"

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

  const { handleFollowToggle } = useFollowArtist({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    artist: artist!,
    showToast: true,
    contextModule,
    contextScreenOwnerType,
    ownerType: Schema.OwnerEntityTypes.Artwork,
  })

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

      {!!displayAuctionSignal && !!collectorSignals?.auction?.lotWatcherCount && (
        <Text pl={0.5} variant="xxs" numberOfLines={1} textAlign="center">
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

  if (enableNewSaveCTA && showSaveIcon) {
    return saveCTA
  } else if (enableNewSaveAndFollowCTAs) {
    return (
      <Flex flexDirection="row">
        <Join separator={<Spacer x={1} />}>
          {!!showSaveIcon && saveCTA}
          {followCTA}
        </Join>
      </Flex>
    )
  } else return <></>
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

const NewHeartIcon = ({ fill, ...restProps }: IconProps) => {
  const color = useColor()

  return (
    <Icon {...restProps} viewBox="0 0 17 17">
      <Path
        d="M8.50004 14.5001L7.53337 13.6334C6.41115 12.6223 5.48337 11.7501 4.75004 11.0167C4.01671 10.2834 3.43337 9.62506 3.00004 9.04172C2.56671 8.45839 2.26393 7.92228 2.09171 7.43339C1.91949 6.9445 1.83337 6.4445 1.83337 5.93339C1.83337 4.88895 2.18337 4.01672 2.88337 3.31672C3.58337 2.61672 4.4556 2.26672 5.50004 2.26672C6.07782 2.26672 6.62782 2.38895 7.15004 2.63339C7.67226 2.87783 8.12226 3.22228 8.50004 3.66672C8.87782 3.22228 9.32782 2.87783 9.85004 2.63339C10.3723 2.38895 10.9223 2.26672 11.5 2.26672C12.5445 2.26672 13.4167 2.61672 14.1167 3.31672C14.8167 4.01672 15.1667 4.88895 15.1667 5.93339C15.1667 6.4445 15.0806 6.9445 14.9084 7.43339C14.7362 7.92228 14.4334 8.45839 14 9.04172C13.5667 9.62506 12.9834 10.2834 12.25 11.0167C11.5167 11.7501 10.5889 12.6223 9.46671 13.6334L8.50004 14.5001ZM8.50004 12.7001C9.56671 11.7445 10.4445 10.9251 11.1334 10.2417C11.8223 9.55839 12.3667 8.96395 12.7667 8.45839C13.1667 7.95284 13.4445 7.50283 13.6 7.10839C13.7556 6.71395 13.8334 6.32228 13.8334 5.93339C13.8334 5.26672 13.6112 4.71117 13.1667 4.26672C12.7223 3.82228 12.1667 3.60006 11.5 3.60006C10.9778 3.60006 10.4945 3.74728 10.05 4.04172C9.6056 4.33617 9.30004 4.71117 9.13337 5.16672H7.86671C7.70004 4.71117 7.39448 4.33617 6.95004 4.04172C6.5056 3.74728 6.02226 3.60006 5.50004 3.60006C4.83337 3.60006 4.27782 3.82228 3.83337 4.26672C3.38893 4.71117 3.16671 5.26672 3.16671 5.93339C3.16671 6.32228 3.24449 6.71395 3.40004 7.10839C3.5556 7.50283 3.83337 7.95284 4.23337 8.45839C4.63337 8.96395 5.17782 9.55839 5.86671 10.2417C6.5556 10.9251 7.43337 11.7445 8.50004 12.7001Z"
        fillRule="nonzero"
        fill={color(fill)}
      />
    </Icon>
  )
}

const NewFillHeartIcon = ({ fill, ...restProps }: IconProps) => {
  const color = useColor()

  return (
    <Icon {...restProps} viewBox="0 0 17 17">
      <Path
        d="M8.49998 14.5001L7.53331 13.6334C6.41109 12.6223 5.48331 11.7501 4.74998 11.0167C4.01665 10.2834 3.43331 9.62506 2.99998 9.04172C2.56665 8.45839 2.26387 7.92228 2.09165 7.43339C1.91942 6.9445 1.83331 6.4445 1.83331 5.93339C1.83331 4.88895 2.18331 4.01672 2.88331 3.31672C3.58331 2.61672 4.45553 2.26672 5.49998 2.26672C6.07776 2.26672 6.62776 2.38895 7.14998 2.63339C7.6722 2.87783 8.1222 3.22228 8.49998 3.66672C8.87776 3.22228 9.32776 2.87783 9.84998 2.63339C10.3722 2.38895 10.9222 2.26672 11.5 2.26672C12.5444 2.26672 13.4166 2.61672 14.1166 3.31672C14.8166 4.01672 15.1666 4.88895 15.1666 5.93339C15.1666 6.4445 15.0805 6.9445 14.9083 7.43339C14.7361 7.92228 14.4333 8.45839 14 9.04172C13.5666 9.62506 12.9833 10.2834 12.25 11.0167C11.5166 11.7501 10.5889 12.6223 9.46665 13.6334L8.49998 14.5001Z"
        fillRule="nonzero"
        fill={color(fill)}
      />
    </Icon>
  )
}

const FollowArtistIcon = ({ fill, ...restProps }: IconProps) => {
  const color = useColor()

  return (
    <Icon {...restProps} viewBox="0 0 17 13">
      <Path
        d="M13.25 8V5.75H11V4.25H13.25V2H14.75V4.25H17V5.75H14.75V8H13.25ZM6.5 6.5C5.675 6.5 4.96875 6.20625 4.38125 5.61875C3.79375 5.03125 3.5 4.325 3.5 3.5C3.5 2.675 3.79375 1.96875 4.38125 1.38125C4.96875 0.79375 5.675 0.5 6.5 0.5C7.325 0.5 8.03125 0.79375 8.61875 1.38125C9.20625 1.96875 9.5 2.675 9.5 3.5C9.5 4.325 9.20625 5.03125 8.61875 5.61875C8.03125 6.20625 7.325 6.5 6.5 6.5ZM0.5 12.5V10.4C0.5 9.975 0.609375 9.58438 0.828125 9.22813C1.04688 8.87188 1.3375 8.6 1.7 8.4125C2.475 8.025 3.2625 7.73438 4.0625 7.54063C4.8625 7.34688 5.675 7.25 6.5 7.25C7.325 7.25 8.1375 7.34688 8.9375 7.54063C9.7375 7.73438 10.525 8.025 11.3 8.4125C11.6625 8.6 11.9531 8.87188 12.1719 9.22813C12.3906 9.58438 12.5 9.975 12.5 10.4V12.5H0.5ZM2 11H11V10.4C11 10.2625 10.9656 10.1375 10.8969 10.025C10.8281 9.9125 10.7375 9.825 10.625 9.7625C9.95 9.425 9.26875 9.17188 8.58125 9.00313C7.89375 8.83438 7.2 8.75 6.5 8.75C5.8 8.75 5.10625 8.83438 4.41875 9.00313C3.73125 9.17188 3.05 9.425 2.375 9.7625C2.2625 9.825 2.17188 9.9125 2.10313 10.025C2.03438 10.1375 2 10.2625 2 10.4V11ZM6.5 5C6.9125 5 7.26563 4.85313 7.55938 4.55938C7.85313 4.26563 8 3.9125 8 3.5C8 3.0875 7.85313 2.73438 7.55938 2.44063C7.26563 2.14688 6.9125 2 6.5 2C6.0875 2 5.73438 2.14688 5.44063 2.44063C5.14688 2.73438 5 3.0875 5 3.5C5 3.9125 5.14688 4.26563 5.44063 4.55938C5.73438 4.85313 6.0875 5 6.5 5Z"
        fillRule="nonzero"
        fill={color(fill)}
      />
    </Icon>
  )
}

const FollowArtistFillIcon = ({ fill, ...restProps }: IconProps) => {
  const color = useColor()

  return (
    <Icon {...restProps} viewBox="0 0 17 13">
      <Path
        d="M4.19894 5.61875C4.78644 6.20625 5.49269 6.5 6.31769 6.5C7.14269 6.5 7.84894 6.20625 8.43644 5.61875C9.02394 5.03125 9.31769 4.325 9.31769 3.5C9.31769 2.675 9.02394 1.96875 8.43644 1.38125C7.84894 0.79375 7.14269 0.5 6.31769 0.5C5.49269 0.5 4.78644 0.79375 4.19894 1.38125C3.61144 1.96875 3.31769 2.675 3.31769 3.5C3.31769 4.325 3.61144 5.03125 4.19894 5.61875ZM0.317688 10.4V12.5H12.3177V10.4C12.3177 9.975 12.2083 9.58438 11.9896 9.22813C11.7708 8.87188 11.4802 8.6 11.1177 8.4125C10.3427 8.025 9.55519 7.73438 8.75519 7.54063C7.95519 7.34688 7.14269 7.25 6.31769 7.25C5.49269 7.25 4.68019 7.34688 3.88019 7.54063C3.08019 7.73438 2.29269 8.025 1.51769 8.4125C1.15519 8.6 0.864563 8.87188 0.645813 9.22813C0.427063 9.58438 0.317688 9.975 0.317688 10.4ZM11.9092 6.80334L10.3182 5.21235L11.3789 4.15169L12.9699 5.74268L15.6217 3.09112L16.6823 4.15178L14.0305 6.80334L12.9699 7.864L11.9092 6.80334Z"
        fillRule="nonzero"
        fill={color(fill)}
      />
    </Icon>
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
