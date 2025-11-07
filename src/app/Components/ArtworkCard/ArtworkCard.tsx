import { ContextModule, OwnerType } from "@artsy/cohesion"
import { HeartFillIcon } from "@artsy/icons/native"
import { Flex, Image, Text, useColor, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtworkCard_artwork$key } from "__generated__/ArtworkCard_artwork.graphql"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { ArtworkCardSaveButton } from "app/Components/ArtworkCard/ArtworkCardSaveButton"
import { ArtworkAuctionTimer } from "app/Components/ArtworkGrids/ArtworkAuctionTimer"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ArtworkSaleMessage } from "app/Components/ArtworkRail/ArtworkSaleMessage"
import { PaginationBars } from "app/Scenes/InfiniteDiscovery/Components/PaginationBars"
import { GlobalStore } from "app/store/GlobalStore"
import { saleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { tracks } from "app/utils/track/ArtworkActions"
import { sizeToFit } from "app/utils/useSizeToFit"
import { memo, useEffect, useRef, useState } from "react"
import { FlatList, GestureResponderEvent, Text as RNText, ViewStyle } from "react-native"
import Haptic from "react-native-haptic-feedback"
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const SAVES_MAX_DURATION_BETWEEN_TAPS = 200
const PAGINATION_BAR_HEIGHT = 11
const PAGINATION_BAR_MARGIN_TOP = 10

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

interface ArtworkCardProps {
  artwork: ArtworkCard_artwork$key
  supportMultipleImages?: boolean
  containerStyle?: ViewStyle
  index: number
  showPager?: boolean
  isSaved?: boolean
  onImageSwipe?: () => void
  contextModule?: ContextModule
  ownerType?: OwnerType
  maxHeight?: number
  scrollX?: SharedValue<number>
  isTopCard?: boolean
}

export const ArtworkCard: React.FC<ArtworkCardProps> = memo(
  ({
    artwork: artworkProp,
    supportMultipleImages = true,
    showPager = true,
    containerStyle,
    isSaved: isSavedProp,
    onImageSwipe,
    contextModule,
    ownerType,
    maxHeight,
    scrollX,
    index,
    isTopCard,
  }) => {
    const { width: screenWidth, height: screenHeight } = useScreenDimensions()
    const space = useSpace()
    const { trackEvent } = useTracking()
    const effectiveWidth = screenWidth
    const paddingHorizontal = space(2)
    const saveAnimationProgress = useSharedValue(0)
    const gestureState = useRef({ lastTapTimestamp: 0, numTaps: 0 })
    const imageCarouselRef = useRef<FlatList>(null)
    const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

    const color = useColor()

    const artwork = useFragment<ArtworkCard_artwork$key>(artworkCardFragment, artworkProp)

    const saleInfo = saleMessageOrBidInfo({
      artwork,
      collectorSignals:
        artwork.collectorSignals as ArtworkGridItem_artwork$data["collectorSignals"],
      auctionSignals: artwork.collectorSignals?.auction,
    })

    // State to track the current image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showScreenTapToSave, setShowScreenTapToSave] = useState(false)

    // Use the hook to manage saving if no custom onSave is provided
    const { isSaved: isSavedToArtworkList, saveArtworkToLists } = useSaveArtworkToArtworkLists({
      artworkFragmentRef: artwork,
      onCompleted: (isArtworkSaved) => {
        trackEvent(
          tracks.saveOrUnsaveArtwork(!!isArtworkSaved, {
            context_module: contextModule,
            context_screen_owner_type: ownerType,
          })
        )
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
    }, [])

    // Width related to the X position
    const prevCardWidth = (index - 1) * screenWidth
    const cardWidth = index * screenWidth
    const nextCardWidth = (index + 1) * screenWidth

    const animatedCardStyle = useAnimatedStyle(() => {
      // If scrollX is provided, use carousel animations
      if (scrollX) {
        return {
          opacity: interpolate(
            scrollX.value,
            [prevCardWidth, cardWidth, nextCardWidth],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          ),
          transform: [
            {
              translateX: interpolate(
                scrollX.value,
                [prevCardWidth, cardWidth, nextCardWidth],
                [-screenWidth * 0.12, 0, screenWidth * 0.12],
                Extrapolation.CLAMP
              ),
            },
            {
              scale: interpolate(
                scrollX.value,
                [prevCardWidth, cardWidth, nextCardWidth],
                [0.9, 1, 0.9],
                Extrapolation.CLAMP
              ),
            },
          ],
        }
      }

      // For InfiniteDiscovery mode, don't apply any animations since AnimatedView handles them
      return {}
    }, [scrollX, index, effectiveWidth, isTopCard])
    const animatedFadeStyle = useAnimatedStyle(() => {
      // If scrollX is provided, use carousel fade animations
      if (scrollX) {
        return {
          opacity: interpolate(
            scrollX.value,
            [prevCardWidth, prevCardWidth + 200, cardWidth, nextCardWidth - 200, nextCardWidth],
            [0, 0, 1, 0, 0],
            Extrapolation.CLAMP
          ),
        }
      }

      // For InfiniteDiscovery mode, always show text elements
      return {
        opacity: 1,
      }
    }, [scrollX, index, cardWidth])

    useEffect(() => {
      if (!isSaved) {
        setShowScreenTapToSave(false)
      }
    }, [isSaved])

    useEffect(() => {
      saveAnimationProgress.value = withTiming(isSavedProp ? 1 : 0, {
        duration: 300,
      })
    }, [isSavedProp, saveAnimationProgress])

    const heartOpacity = useSharedValue(0)

    const savedArtworkAnimationStyles = useAnimatedStyle(() => {
      return {
        opacity: heartOpacity.value,
      }
    }, [])

    useEffect(() => {
      if (isSavedProp || showScreenTapToSave) {
        heartOpacity.value = withSequence(
          withTiming(1, { duration: 300, easing: Easing.linear }),
          withDelay(500, withTiming(0, { duration: 300, easing: Easing.linear }))
        )
      } else {
        heartOpacity.value = withTiming(0, { duration: 300 })
      }
    }, [isSavedProp, showScreenTapToSave])

    if (!artwork || !artwork.images || artwork.images.length === 0) {
      return null
    }

    const DEFAULT_MAX_ARTWORK_HEIGHT = screenHeight * 0.55
    const actualMaxHeight = maxHeight || DEFAULT_MAX_ARTWORK_HEIGHT

    const hasMultipleImages = supportMultipleImages && artwork.images.length > 1
    const displayImages = supportMultipleImages ? artwork.images : [artwork.images[0]]
    const shouldShowPager = showPager && hasMultipleImages

    // When there are multiple images and pager is shown, adjust the max height to allow space for pagination bar
    const adjustedMaxHeight = shouldShowPager
      ? actualMaxHeight - PAGINATION_BAR_HEIGHT - PAGINATION_BAR_MARGIN_TOP
      : actualMaxHeight

    const handleWrapperTaps = (event: GestureResponderEvent) => {
      const now = Date.now()
      const state = gestureState.current
      const { nativeEvent } = event
      const { locationX } = nativeEvent

      const widthFifth = effectiveWidth / 5
      // Determine which part of the screen was tapped
      const leftFifth = locationX < widthFifth
      const rightFifth = locationX > effectiveWidth - widthFifth
      const middleSection = !leftFifth && !rightFifth

      // Handle double-tap to save - only works in middle section or when single image
      if (middleSection || displayImages.length === 1) {
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

      // Handle image navigation for multiple images
      if (hasMultipleImages) {
        if (leftFifth && currentImageIndex > 0) {
          Haptic.trigger("impactLight")
          onImageSwipe?.()
          imageCarouselRef.current?.scrollToIndex({ index: currentImageIndex - 1 })
          setCurrentImageIndex(currentImageIndex - 1)
          return true
        }

        if (rightFifth && currentImageIndex < displayImages.length - 1) {
          Haptic.trigger("impactLight")
          onImageSwipe?.()
          imageCarouselRef.current?.scrollToIndex({ index: currentImageIndex + 1 })
          setCurrentImageIndex(currentImageIndex + 1)
        }
      }
    }

    const handleSavePress = () => {
      saveArtworkToLists()
    }

    const firstImage = displayImages[0]
    const size = sizeToFit(
      { width: firstImage?.width ?? 0, height: firstImage?.height ?? 0 },
      { width: screenWidth - paddingHorizontal * 2, height: adjustedMaxHeight }
    )

    return (
      <AnimatedFlex
        width={screenWidth}
        height="100%"
        style={[
          containerStyle || { borderRadius: 10, backgroundColor: color("mono0") },
          animatedCardStyle,
        ]}
      >
        {!!artwork.artists?.[0] && (
          <AnimatedFlex p={2} style={animatedFadeStyle}>
            <ArtistListItemContainer
              artist={artwork.artists[0]}
              avatarSize="xxs"
              includeTombstone={false}
              contextModule={contextModule}
              contextScreenOwnerId={artwork.internalID}
              contextScreenOwnerSlug={artwork.slug}
            />
          </AnimatedFlex>
        )}

        {/* Image Section */}
        <Flex alignItems="center" minHeight={adjustedMaxHeight} justifyContent="center">
          {/* Save Animation Overlay */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor:
                  theme === "light" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
              },
              savedArtworkAnimationStyles,
            ]}
          >
            <HeartFillIcon height={64} width={64} fill="mono0" />
          </Animated.View>

          {/* Touch Handler */}
          <Flex
            onStartShouldSetResponder={(event) => {
              if (event.nativeEvent.touches && event.nativeEvent.touches.length > 1) {
                return false
              }
              return true
            }}
            onStartShouldSetResponderCapture={() => false}
            onMoveShouldSetResponder={() => false}
            onMoveShouldSetResponderCapture={() => false}
            onResponderRelease={handleWrapperTaps}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 100,
            }}
          />

          {/* Image Display */}
          {supportMultipleImages ? (
            <FlatList
              data={displayImages}
              ref={imageCarouselRef}
              renderItem={({ item }) => {
                const size = sizeToFit(
                  { width: item?.width ?? 0, height: item?.height ?? 0 },
                  { width: effectiveWidth, height: adjustedMaxHeight }
                )

                return (
                  <Flex width={effectiveWidth} alignItems="center">
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
          ) : (
            <Flex width="100%" alignItems="center">
              <Image
                src={firstImage?.url ?? ""}
                width={size.width}
                height={size.height}
                blurhash={firstImage?.blurhash}
              />
            </Flex>
          )}
        </Flex>

        {/* Pagination Bar */}
        {!!shouldShowPager && (
          <Flex
            mt={1}
            height={PAGINATION_BAR_HEIGHT}
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <PaginationBars currentIndex={currentImageIndex} length={displayImages.length} />
          </Flex>
        )}

        {/* Artwork Info and Save Button */}
        <AnimatedFlex
          flexDirection="row"
          justifyContent="space-between"
          p={2}
          gap={1}
          style={animatedFadeStyle}
        >
          <Flex flex={1} justifyContent="center">
            <Flex flexDirection="row">
              <RNText numberOfLines={1}>
                <Text color="mono60" variant="sm-display">
                  <Text italic ellipsizeMode="tail" color="mono60" variant="sm-display">
                    {artwork.title}
                  </Text>
                  {!!artwork.date && `, ${artwork.date}`}
                </Text>
              </RNText>
            </Flex>

            {/* Price */}
            {!!saleInfo && (
              <ArtworkSaleMessage
                artwork={artwork}
                saleMessage={saleInfo}
                displayLimitedTimeOfferSignal={false}
              />
            )}

            {!!artwork.sale?.isAuction && !!artwork.collectorSignals && (
              <ArtworkAuctionTimer collectorSignals={artwork.collectorSignals} />
            )}
          </Flex>

          <ArtworkCardSaveButton
            isSaved={!!isSaved}
            onPress={handleSavePress}
            animatedStyle={animatedSaveButtonStyles}
          />
        </AnimatedFlex>
      </AnimatedFlex>
    )
  }
)

const artworkCardFragment = graphql`
  fragment ArtworkCard_artwork on Artwork {
    ...useSaveArtworkToArtworkLists_artwork
    ...ArtworkSaleMessage_artwork

    collectorSignals {
      ...ArtworkAuctionTimer_collectorSignals

      primaryLabel
      auction {
        bidCount
        liveBiddingStarted
        lotClosesAt
        lotWatcherCount
      }
      partnerOffer {
        endAt
        isAvailable
        priceWithDiscount {
          display
        }
      }
    }

    internalID
    slug
    title
    date
    artistNames
    saleMessage
    isSaved
    artists(shallow: true) {
      ...ArtistListItem_artist
    }
    images {
      url(version: "large")
      width
      height
      aspectRatio
      blurhash
    }
    sale {
      isAuction
      isClosed
    }
    saleArtwork {
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
    }
  }
`
