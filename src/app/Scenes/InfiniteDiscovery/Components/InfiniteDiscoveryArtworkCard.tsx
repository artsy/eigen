import { ContextModule, OwnerType } from "@artsy/cohesion"
import { HeartFillIcon, HeartStrokeIcon } from "@artsy/icons/native"
import {
  Flex,
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
import { PaginationBars } from "app/Scenes/InfiniteDiscovery/Components/PaginationBars"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1,
  PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2,
} from "app/store/ProgressiveOnboardingModel"
import { Schema } from "app/utils/track"
import { sizeToFit } from "app/utils/useSizeToFit"
import { memo, useEffect, useRef, useState } from "react"
import { GestureResponderEvent, Text as RNText, ViewStyle } from "react-native"
import Haptic from "react-native-haptic-feedback"
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

const SAVES_MAX_DURATION_BETWEEN_TAPS = 200

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
    const gestureState = useRef({ lastTapTimestamp: 0, numTaps: 0 })

    const { trackEvent } = useTracking()
    const color = useColor()
    const { incrementSavedArtworksCount, decrementSavedArtworksCount } =
      GlobalStore.actions.infiniteDiscovery

    const artwork = useFragment<InfiniteDiscoveryArtworkCard_artwork$key>(
      infiniteDiscoveryArtworkCardFragment,
      artworkProp
    )

    // State to track the current image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
      },
      onError: () => {
        /**
         * This logic assumes that the saved artworks count was optimistically incremented or decremented when the save button was pressed.
         * If the save operation fails, we need to revert the saved artworks count to its previous state.
         * This is needed because the optimisticUpdater callback in useSaveArtworkToArtworkLists performs some actions that can take severel seconds to complete,
         * and as a result the saved artworks count can be out of sync with the actual state of the artwork.
         */
        if (isSaved) {
          // if the artwork is currently saved, we optimistically decremented the count, so increment it back
          incrementSavedArtworksCount()
        } else {
          // if the artwork is currently unsaved, we optimistically incremented the count, so decrement it back
          decrementSavedArtworksCount()
        }
      },
    })

    const isSaved = isSavedProp !== undefined ? isSavedProp : isSavedToArtworkList
    const [showScreenTapToSave, setShowScreenTapToSave] = useState(false)

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
      // Revert showScreenTapToSave if the artwork is not saved
      // This is required to make sure we show the heart overlay again
      if (!isSaved) {
        setShowScreenTapToSave(false)
      }
    }, [isSaved])

    useEffect(() => {
      saveAnimationProgress.value = withTiming(isSavedProp ? 1 : 0, {
        duration: 300,
      })
    }, [isSavedProp])

    const savedArtworkAnimationStyles = useAnimatedStyle(() => {
      return {
        opacity:
          isSavedProp || showScreenTapToSave
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

    const images = artwork.images || []
    const hasMultipleImages = images.length > 1
    const selectedImage = images[currentImageIndex]
    const src = selectedImage?.url
    const width = selectedImage?.width ?? 0
    const height = selectedImage?.height ?? 0
    const blurhash = selectedImage?.blurhash ?? undefined

    // When there are multiple images, adjust the max height to allow space for pagination bar
    const adjustedMaxHeight = hasMultipleImages
      ? MAX_ARTWORK_HEIGHT - PAGINATION_BAR_HEIGHT - PAGINATION_BAR_MARGIN_TOP
      : MAX_ARTWORK_HEIGHT

    const size = sizeToFit({ width, height }, { width: screenWidth, height: adjustedMaxHeight })

    const handleWrapperTaps = (event: GestureResponderEvent) => {
      const now = Date.now()
      const state = gestureState.current
      const { nativeEvent } = event
      const { locationX } = nativeEvent
      const screenFifth = screenWidth / 5

      // Determine which part of the screen was tapped
      const leftFifth = locationX < screenFifth
      const rightFifth = locationX > screenWidth - screenFifth
      const middleSection = !leftFifth && !rightFifth

      // Handle image navigation in left/right fifths with single tap
      if (images.length > 1) {
        if (leftFifth && currentImageIndex > 0) {
          // For left fifth, navigate to previous image on single tap
          Haptic.trigger("impactLight")
          trackEvent(tracks.artworkImageSwipe())
          setCurrentImageIndex(currentImageIndex - 1)
          return true
        } else if (rightFifth && currentImageIndex < images.length - 1) {
          // For right fifth, navigate to next image on single tap
          Haptic.trigger("impactLight")
          trackEvent(tracks.artworkImageSwipe())
          setCurrentImageIndex(currentImageIndex + 1)
          return true
        }
      }

      // Handle double-tap to save:
      // For single images, allow double-tap anywhere on the image
      // For multiple images, only allow double-tap in the middle 60%
      if (images.length === 1 || middleSection) {
        if (now - state.lastTapTimestamp < SAVES_MAX_DURATION_BETWEEN_TAPS) {
          state.numTaps += 1
        } else {
          state.numTaps = 1
        }

        state.lastTapTimestamp = now

        if (state.numTaps === 2) {
          state.numTaps = 0
          if (!isSaved) {
            Haptic.trigger("impactLight")
            setShowScreenTapToSave(true)
            saveArtworkToLists()
          }
          return true
        }
      }

      return false
    }

    return (
      <Flex backgroundColor="mono0" width="100%" style={containerStyle || { borderRadius: 10 }}>
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
        <Flex alignItems="center" minHeight={adjustedMaxHeight} justifyContent="center">
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
            <HeartFillIcon height={64} width={64} fill="mono0" />
          </Animated.View>
          <Flex
            // Only handle initial touches
            onStartShouldSetResponder={(event) => {
              // Let parent handle multi-touch gestures (like pinch zoom)
              if (event.nativeEvent.touches && event.nativeEvent.touches.length > 1) {
                return false
              }
              return true
            }}
            // But don't capture them from children
            onStartShouldSetResponderCapture={() => false}
            // Don't try to handle moves (let the Swiper handle them)
            onMoveShouldSetResponder={() => false}
            onMoveShouldSetResponderCapture={() => false}
            // Handle taps on release
            onResponderRelease={handleWrapperTaps}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 100,
            }}
          />
          {!!src && <Image src={src} height={size.height} width={size.width} blurhash={blurhash} />}
        </Flex>

        {!!hasMultipleImages && (
          <Flex
            mt={1} // keep consistent with PAGINATION_BAR_MARGIN_TOP to resize image
            height={PAGINATION_BAR_HEIGHT}
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <PaginationBars currentIndex={currentImageIndex} length={images.length} />
          </Flex>
        )}
        <Flex flexDirection="row" justifyContent="space-between" p={2} gap={1}>
          <Flex flex={1}>
            <Flex flexDirection="row">
              <RNText numberOfLines={1}>
                <Text color="mono60" variant="sm-display">
                  <Text italic ellipsizeMode="tail" color="mono60" variant="sm-display">
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

              if (isSaved) {
                // if the artwork is currently saved, it will become unsaved, so optimistically decrement the count
                decrementSavedArtworksCount()
              } else {
                // if the artwork is currently unsaved, it will become saved, so optimistically decrement the count
                incrementSavedArtworksCount()
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
                  backgroundColor: color("mono5"),
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
                  <HeartStrokeIcon
                    testID="empty-heart-icon"
                    height={HEART_ICON_SIZE}
                    width={HEART_ICON_SIZE}
                    fill="mono100"
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
const FIRST_REMINDER_SWIPES_COUNT = 4
const SECOND_REMINDER_SWIPES_COUNT = 29

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
          <Text variant="xs" color="mono0" fontWeight="bold">
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
      blurhash
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
const PAGINATION_BAR_HEIGHT = 11
const PAGINATION_BAR_MARGIN_TOP = 10

const tracks = {
  artworkImageSwipe: () => ({
    action_name: Schema.ActionNames.ArtworkImageSwipe,
    action_type: Schema.ActionTypes.Tap,
    context_module: ContextModule.infiniteDiscoveryArtworkCard,
  }),
}
