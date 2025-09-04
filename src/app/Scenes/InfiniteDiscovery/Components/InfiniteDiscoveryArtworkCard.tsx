import { ContextModule } from "@artsy/cohesion"
import { HeartFillIcon, HeartStrokeIcon } from "@artsy/icons/native"
import { Flex, Image, Text, Touchable, useColor, useScreenDimensions } from "@artsy/palette-mobile"
import {
  InfiniteDiscoveryArtworkCard_artwork$data,
  InfiniteDiscoveryArtworkCard_artwork$key,
} from "__generated__/InfiniteDiscoveryArtworkCard_artwork.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { InfiniteDiscoveryArtworkCardPopover } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryArtworkCardPopover"
import { PaginationBars } from "app/Scenes/InfiniteDiscovery/Components/PaginationBars"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { sizeToFit } from "app/utils/useSizeToFit"
import { memo, useEffect, useRef, useState } from "react"
import { FlatList, GestureResponderEvent, Text as RNText, ViewStyle } from "react-native"
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
    const imageCarouselRef = useRef<FlatList>(null)

    const track = useInfiniteDiscoveryTracking()
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
      artworkFragmentRef: artwork as NonNullable<InfiniteDiscoveryArtworkCard_artwork$data>,
      onCompleted: (isArtworkSaved) => {
        if (!!artwork) {
          track.savedArtwork(isArtworkSaved, artwork.internalID, artwork.slug)
        }
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

    const images = artwork.images
    const hasMultipleImages = images.length > 1

    // When there are multiple images, adjust the max height to allow space for pagination bar
    const adjustedMaxHeight = hasMultipleImages
      ? MAX_ARTWORK_HEIGHT - PAGINATION_BAR_HEIGHT - PAGINATION_BAR_MARGIN_TOP
      : MAX_ARTWORK_HEIGHT

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

      if (middleSection || images.length === 1) {
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

      if (leftFifth && currentImageIndex > 0) {
        Haptic.trigger("impactLight")
        track.artworkImageSwipe()
        imageCarouselRef.current?.scrollToIndex({ index: currentImageIndex - 1 })
        setCurrentImageIndex(currentImageIndex - 1)
        return true
      }

      if (rightFifth && currentImageIndex < images.length - 1) {
        Haptic.trigger("impactLight")
        track.artworkImageSwipe()
        imageCarouselRef.current?.scrollToIndex({ index: currentImageIndex + 1 })
        setCurrentImageIndex(currentImageIndex + 1)
      }
    }

    return (
      <Flex backgroundColor="mono0" width="100%" style={containerStyle || { borderRadius: 10 }}>
        <Flex p={2}>
          <ArtistListItemContainer
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            artist={artwork.artists?.[0]!}
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
          <FlatList
            data={artwork.images}
            ref={imageCarouselRef}
            renderItem={({ item }) => {
              const size = sizeToFit(
                { width: item?.width ?? 0, height: item?.height ?? 0 },
                { width: screenWidth, height: adjustedMaxHeight }
              )

              return (
                <Flex width={screenWidth} alignItems="center">
                  <Image
                    src={item?.url ?? ""}
                    width={size.width}
                    height={size.height}
                    blurhash={item?.blurhash}
                  />
                </Flex>
              )
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
          />
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
            accessibilityRole="button"
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
            <InfiniteDiscoveryArtworkCardPopover index={index} isTopCard={isTopCard}>
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
            </InfiniteDiscoveryArtworkCardPopover>
          </Touchable>
        </Flex>
      </Flex>
    )
  }
)

const infiniteDiscoveryArtworkCardFragment = graphql`
  fragment InfiniteDiscoveryArtworkCard_artwork on Artwork {
    artistNames
    artists(shallow: true) {
      ...ArtistListItem_artist
    }
    date
    id
    internalID @required(action: NONE)
    images @required(action: NONE) {
      url(version: "large")
      width
      height
      blurhash
    }
    isSaved
    saleMessage
    slug @required(action: NONE)
    title
    ...useSaveArtworkToArtworkLists_artwork
  }
`

const HEART_ICON_SIZE = 18
const HEART_CIRCLE_SIZE = 50
const SAVE_BUTTON_WIDTH = 105
const PAGINATION_BAR_HEIGHT = 11
const PAGINATION_BAR_MARGIN_TOP = 10
