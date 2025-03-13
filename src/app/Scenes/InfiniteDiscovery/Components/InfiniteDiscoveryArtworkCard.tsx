import { ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Flex,
  HeartFillIcon,
  HeartIcon,
  Image,
  Popover,
  Text,
  Touchable,
  useColor,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { InfiniteDiscoveryArtworkCard_artwork$key } from "__generated__/InfiniteDiscoveryArtworkCard_artwork.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1,
  PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2,
} from "app/store/ProgressiveOnboardingModel"
import { Schema } from "app/utils/track"
import { sizeToFit } from "app/utils/useSizeToFit"
import { memo, useEffect, useRef } from "react"
import { ViewStyle, Text as RNText } from "react-native"
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface InfiniteDiscoveryArtworkCardProps {
  artwork: InfiniteDiscoveryArtworkCard_artwork$key
  containerStyle?: ViewStyle
  // This is only used for the onboarding animation
  isSaved?: boolean
  index: number
  isTopCard: boolean
}

export const InfiniteDiscoveryArtworkCard: React.FC<InfiniteDiscoveryArtworkCardProps> = memo(
  ({ artwork: artworkProp, containerStyle, isSaved: isSavedProp, index, isTopCard }) => {
    const { width: screenWidth, height: screenHeight } = useScreenDimensions()
    const saveAnimationProgress = useSharedValue(0)
    const { hasSavedArtworks } = GlobalStore.useAppState((state) => state.infiniteDiscovery)
    const setHasSavedArtwors = GlobalStore.actions.infiniteDiscovery.setHasSavedArtworks

    const { trackEvent } = useTracking()
    const color = useColor()
    const { incrementSavedArtworksCount, decrementSavedArtworksCount } =
      GlobalStore.actions.infiniteDiscovery

    const artworkData = useFragment<InfiniteDiscoveryArtworkCard_artwork$key>(
      infiniteDiscoveryArtworkCardFragment,
      artworkProp
    )

    // This is a workaround to avoid relay removing the fragment from the cache
    const artwork = useRef(artworkData).current

    const { isSaved: isSavedToArtworkList, saveArtworkToLists } = useSaveArtworkToArtworkLists({
      artworkFragmentRef: artwork,
      onCompleted: (isArtworkSaved) => {
        trackEvent({
          action_name: isArtworkSaved
            ? Schema.ActionNames.ArtworkSave
            : Schema.ActionNames.ArtworkUnsave,
          action_type: Schema.ActionTypes.Success,
          context_module: ContextModule.infiniteDiscoveryArtworkCard,
          context_screen_owner_id: artwork.internalID,
          context_screen_owner_slug: artwork.slug,
          context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
        })

        if (isArtworkSaved) {
          incrementSavedArtworksCount()
        } else {
          decrementSavedArtworksCount()
        }
      },
    })

    const isSaved = isSavedProp !== undefined ? isSavedProp : isSavedToArtworkList

    const animatedSaveButtonStyles = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(saveAnimationProgress.value, [0, 0.5, 1], [1, 1.2, 1]),
          },
        ],
      }
    })

    useEffect(() => {
      saveAnimationProgress.value = withTiming(isSavedProp ? 1 : 0, {
        duration: 300,
      })
    }, [isSavedProp])

    const savedArtworkAnimationStyles = useAnimatedStyle(() => {
      return {
        opacity: isSavedProp
          ? withSequence(
              withTiming(1, { duration: 300, easing: Easing.linear }),
              withDelay(500, withTiming(0, { duration: 300, easing: Easing.linear }))
            )
          : 0,
      }
    })

    if (!artwork) {
      return null
    }

    const MAX_ARTWORK_HEIGHT = screenHeight * 0.55

    const src = artwork.images?.[0]?.url
    const width = artwork.images?.[0]?.width ?? 0
    const height = artwork.images?.[0]?.height ?? 0

    const size = sizeToFit({ width, height }, { width: screenWidth, height: MAX_ARTWORK_HEIGHT })

    return (
      <Flex backgroundColor="white100" width="100%" style={containerStyle || { borderRadius: 10 }}>
        <Flex p={2}>
          <ArtistListItemContainer
            artist={artwork.artists?.[0]}
            avatarSize="xxs"
            includeTombstone={false}
            contextModule={ContextModule.infiniteDiscoveryArtworkCard}
            contextScreenOwnerId={artwork.internalID}
            contextScreenOwnerSlug={artwork.slug}
          />
        </Flex>
        <Flex alignItems="center" minHeight={MAX_ARTWORK_HEIGHT} justifyContent="center">
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
              },
              savedArtworkAnimationStyles,
            ]}
          >
            <HeartFillIcon height={64} width={64} fill="white100" />
          </Animated.View>

          {!!src && <Image src={src} height={size.height} width={size.width} />}
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" p={2} gap={1}>
          <Flex flex={1}>
            {/* TODO: remove this when we are done with the infinite discovery */}
            {!!__DEV__ && (
              <Text color="blue" variant="sm-display" ellipsizeMode="tail" numberOfLines={1}>
                {artwork.internalID}
              </Text>
            )}

            <Flex flexDirection="row">
              <RNText numberOfLines={1}>
                <Text color="black60" variant="sm-display">
                  <Text italic ellipsizeMode="tail" color="black60" variant="sm-display">
                    {artwork.title}
                  </Text>
                  , {artwork.date}
                </Text>
              </RNText>
            </Flex>
            <Text variant="sm-display">{artwork.saleMessage}</Text>
          </Flex>
          <Touchable
            haptic
            hitSlop={{ bottom: 10, right: 10, left: 10, top: 10 }}
            onPress={() => {
              if (!hasSavedArtworks) {
                setHasSavedArtwors(true)
              }
              saveArtworkToLists()
            }}
            testID="save-artwork-icon"
          >
            <PopoverWrapper index={index} internalID={artwork.internalID} isTopCard={isTopCard}>
              <Flex
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                style={{
                  width: SAVE_BUTTON_WIDTH,
                  height: HEART_CIRCLE_SIZE,
                  borderRadius: 30,
                  backgroundColor: color("black5"),
                }}
              >
                {!!isSaved ? (
                  <Animated.View style={animatedSaveButtonStyles}>
                    <HeartFillIcon
                      testID="filled-heart-icon"
                      height={HEART_ICON_SIZE}
                      width={HEART_ICON_SIZE}
                      fill="blue100"
                    />
                  </Animated.View>
                ) : (
                  <HeartIcon
                    testID="empty-heart-icon"
                    height={HEART_ICON_SIZE}
                    width={HEART_ICON_SIZE}
                    fill="black100"
                  />
                )}
                <Text ml={0.5} variant="xs">
                  {isSaved ? "Saved" : "Save"}
                </Text>
              </Flex>
            </PopoverWrapper>
          </Touchable>
        </Flex>
      </Flex>
    )
  }
)

const FIRST_REMINDER_SWIPES_COUNT = 5
const SECOND_REMINDER_SWIPES_COUNT = 30

const PopoverWrapper: React.FC<{
  isTopCard: boolean
  index: number
  internalID: string
  children: JSX.Element
}> = ({ children, index, isTopCard }) => {
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const { hasSavedArtworks } = GlobalStore.useAppState((state) => state.infiniteDiscovery)

  const showSaveAlertReminder1 =
    index === FIRST_REMINDER_SWIPES_COUNT &&
    !isDismissed(PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1).status &&
    isReady
  const showSaveAlertReminder2 =
    index === SECOND_REMINDER_SWIPES_COUNT &&
    !isDismissed(PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2).status &&
    isReady

  const dismissPopover = () => {
    switch (index) {
      case FIRST_REMINDER_SWIPES_COUNT:
        dismiss(PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1)
        break

      case SECOND_REMINDER_SWIPES_COUNT:
        dismiss(PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2)
        break
      default:
        break
    }
  }

  if (isTopCard && !hasSavedArtworks && (showSaveAlertReminder1 || showSaveAlertReminder2)) {
    return (
      <Popover
        visible
        onDismiss={dismissPopover}
        onPressOutside={dismissPopover}
        title={
          <Text variant="xs" color="white100" fontWeight="bold">
            Save artworks to get better{"\n"}recommendations and to signal your{"\n"}interest to
            galleries.
          </Text>
        }
        placement="top"
      >
        {children}
      </Popover>
    )
  }
  return <Flex>{children}</Flex>
}
const infiniteDiscoveryArtworkCardFragment = graphql`
  fragment InfiniteDiscoveryArtworkCard_artwork on Artwork {
    artistNames
    artists(shallow: true) {
      ...ArtistListItem_artist
    }
    date
    id
    internalID
    images {
      url(version: "large")
      width
      height
    }
    isSaved
    saleMessage
    slug
    title
    ...useSaveArtworkToArtworkLists_artwork
  }
`

const HEART_ICON_SIZE = 18
const HEART_CIRCLE_SIZE = 50
const SAVE_BUTTON_WIDTH = 105
