import { ContextModule, OwnerType } from "@artsy/cohesion"
import { HeartFillIcon } from "@artsy/icons/native"
import {
  Box,
  Flex,
  Image,
  Text,
  useColor,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { ArtworkCard_artwork$key } from "__generated__/ArtworkCard_artwork.graphql"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { ArtworkCardSaveButton } from "app/Components/ArtworkCard/ArtworkCardSaveButton"
import { ArtworkAuctionTimer } from "app/Components/ArtworkGrids/ArtworkAuctionTimer"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ArtworkSaleMessage } from "app/Components/ArtworkRail/ArtworkSaleMessage"
import { GlobalStore } from "app/store/GlobalStore"
import { saleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { tracks } from "app/utils/track/ArtworkActions"
import { sizeToFit } from "app/utils/useSizeToFit"
import { memo, useEffect, useRef, useState } from "react"
import { ScrollView, Text as RNText, ViewStyle } from "react-native"
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
const THUMBNAIL_HEIGHT = 40
const THUMBNAIL_WIDTH = 32
const ACTIVE_THUMBNAIL_BORDER = 2
const THUMBNAIL_WIDTH_WITH_PADDING = THUMBNAIL_WIDTH + 10 // 10px padding between thumbnails

// TODO: crop THUMBNAIL image when the image is either too long or too wide

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

interface ArtworkCardProps {
  artwork: ArtworkCard_artwork$key
  containerStyle?: ViewStyle
  index: number
  isSaved?: boolean
  onImageSwipe?: () => void
  contextModule?: ContextModule
  ownerType?: OwnerType
  scrollX?: SharedValue<number>
  isTopCard?: boolean
  prevCardImageSize?: { width: number; height: number }
  nextCardImageSize?: { width: number; height: number }
  maxImageWidth: number
  maxImageHeight: number
}

export const ArtworkCard: React.FC<ArtworkCardProps> = memo(
  ({
    artwork: artworkProp,
    containerStyle,
    isSaved: isSavedProp,
    onImageSwipe,
    contextModule,
    ownerType,
    scrollX,
    index,
    isTopCard,
    prevCardImageSize,
    nextCardImageSize,
    maxImageWidth,
    maxImageHeight,
  }) => {
    const { width: screenWidth } = useScreenDimensions()
    const space = useSpace()
    const color = useColor()
    const { trackEvent } = useTracking()
    const paddingHorizontal = space(2)
    const saveAnimationProgress = useSharedValue(0)
    const heartOpacity = useSharedValue(0)
    const gestureState = useRef({ lastTapTimestamp: 0, numTaps: 0 })
    const thumbnailScrollRef = useRef<ScrollView>(null)
    // Tracks whether user is manually scrolling thumbnails (drag/momentum)
    const isUserScrolling = useRef(false)
    // Prevents onScroll updates during programmatic scroll (tap navigation)
    const isAnimatingToIndex = useRef(false)
    const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)
    // State to track the current image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showScreenTapToSave, setShowScreenTapToSave] = useState(false)

    const artwork = useFragment<ArtworkCard_artwork$key>(artworkCardFragment, artworkProp)

    const saleInfo = saleMessageOrBidInfo({
      artwork,
      collectorSignals:
        artwork.collectorSignals as ArtworkGridItem_artwork$data["collectorSignals"],
      auctionSignals: artwork.collectorSignals?.auction,
    })

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

    const displayImages = artwork.images

    const currentImage = displayImages ? displayImages[currentImageIndex] : null

    const previmageWidth = prevCardImageSize?.width ?? 0
    const nextimageWidth = nextCardImageSize?.width ?? 0

    const currentImageSize = sizeToFit(
      { width: currentImage?.width ?? 0, height: currentImage?.height ?? 0 },
      { width: maxImageWidth, height: maxImageHeight }
    )
    // Width related to the X position
    const prevCardWidth = (index - 1) * screenWidth
    const cardWidth = index * screenWidth
    const nextCardWidth = (index + 1) * screenWidth

    const animatedCardStyle = useAnimatedStyle(() => {
      // If scrollX is provided, use carousel animations
      if (scrollX) {
        return {
          transform: [
            {
              translateX: interpolate(
                scrollX.value,
                [prevCardWidth, cardWidth, nextCardWidth],
                [
                  (-screenWidth -
                    (screenWidth -
                      (previmageWidth > (maxImageWidth * 2) / 3 ? previmageWidth : maxImageWidth) -
                      paddingHorizontal / 2)) *
                    0.14,
                  0,
                  (screenWidth +
                    (screenWidth -
                      (nextimageWidth > (maxImageWidth * 2) / 3 ? nextimageWidth : maxImageWidth) -
                      paddingHorizontal / 2)) *
                    0.14,
                ],
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
    }, [scrollX, index, screenWidth, isTopCard])

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
    }, [isSavedProp, showScreenTapToSave, heartOpacity])

    // Sync thumbnail scroll when tapping thumbnail (not during manual scrolling)
    useEffect(() => {
      if (thumbnailScrollRef.current && !isUserScrolling.current) {
        isAnimatingToIndex.current = true
        thumbnailScrollRef.current.scrollTo({
          x: currentImageIndex * THUMBNAIL_WIDTH_WITH_PADDING,
          animated: true,
        })
      }

      setTimeout(() => {
        isAnimatingToIndex.current = false
      }, 300)
    }, [currentImageIndex])

    if (!artwork || artwork?.images?.length === 0 || !displayImages) {
      return null
    }

    const handleWrapperTaps = () => {
      const now = Date.now()
      const state = gestureState.current

      // Handle double-tap to save - only works in middle section or when single image
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

    const handleSavePress = () => {
      saveArtworkToLists()
    }

    const thumbnailGalleryWidth = maxImageWidth * 0.9

    const handleThumbnailScroll = (event: any) => {
      // Only respond to user-initiated scrolls
      if (!isUserScrolling.current || isAnimatingToIndex.current) return

      const scrollPosition = event.nativeEvent.contentOffset.x
      const newIndex = Math.round(scrollPosition / THUMBNAIL_WIDTH_WITH_PADDING)
      const clampedIndex = Math.max(0, Math.min(displayImages.length - 1, newIndex))

      if (clampedIndex !== currentImageIndex) {
        setCurrentImageIndex(clampedIndex)
      }
    }

    const renderThumbnail = (item: any, idx: number) => {
      const isActive = idx === currentImageIndex
      const thumbnailSize = sizeToFit(
        { width: item?.width ?? 0, height: item?.height ?? 0 },
        { width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }
      )

      const thumbnailWidth =
        thumbnailSize.width / THUMBNAIL_WIDTH < 0.5 ? THUMBNAIL_WIDTH : thumbnailSize.width
      const thumbnailHeight =
        thumbnailSize.height / THUMBNAIL_HEIGHT < 0.5 ? THUMBNAIL_HEIGHT : thumbnailSize.height

      return (
        <Flex
          key={idx}
          pr={1}
          // Allow this component to handle touch events
          onStartShouldSetResponder={() => true}
          // Handle thumbnail tap to switch image
          onResponderRelease={() => {
            setCurrentImageIndex(idx)
            onImageSwipe?.()
          }}
        >
          <Box
            borderWidth={isActive ? ACTIVE_THUMBNAIL_BORDER : 0}
            borderColor={isActive ? color("mono100") : undefined}
          >
            <Image
              testID="thumbnail-image"
              src={item?.url ?? ""}
              width={thumbnailWidth}
              height={thumbnailHeight}
              blurhash={item?.blurhash}
            />
          </Box>
        </Flex>
      )
    }

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
        <Flex alignItems="center" height={maxImageHeight} justifyContent="center">
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
            // Claim touch events, but reject multi-touch gestures
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
          <Flex width="100%" alignItems="center">
            <Image
              key={`main-image-${currentImageIndex}`}
              src={displayImages[currentImageIndex]?.url ?? ""}
              width={currentImageSize.width}
              height={currentImageSize.height}
              blurhash={displayImages[currentImageIndex]?.blurhash}
            />
          </Flex>
        </Flex>

        {/* Thumbnail Gallery */}
        <Flex
          my={2}
          width={screenWidth}
          alignItems="center"
          justifyContent="center"
          height={THUMBNAIL_HEIGHT + ACTIVE_THUMBNAIL_BORDER * 2}
        >
          <Flex width={thumbnailGalleryWidth} overflow="visible">
            <ScrollView
              ref={thumbnailScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={THUMBNAIL_WIDTH_WITH_PADDING}
              nestedScrollEnabled={true}
              overScrollMode="never"
              contentContainerStyle={{
                alignItems: "center",
                // Center the active thumbnail: half thumbnail gallery width minus half thumbnail width and border
                paddingHorizontal:
                  thumbnailGalleryWidth / 2 - THUMBNAIL_WIDTH / 2 - ACTIVE_THUMBNAIL_BORDER,
              }}
              onScrollBeginDrag={() => {
                isUserScrolling.current = true
              }}
              onMomentumScrollBegin={() => {
                isUserScrolling.current = true
              }}
              onMomentumScrollEnd={() => {
                isUserScrolling.current = false
              }}
              onScroll={handleThumbnailScroll}
              scrollEventThrottle={16}
              disableIntervalMomentum
            >
              {displayImages.map((item, idx) => renderThumbnail(item, idx))}
            </ScrollView>
          </Flex>
        </Flex>

        {/* Artwork Info and Save Button */}
        <AnimatedFlex
          flexDirection="row"
          justifyContent="space-between"
          px={2}
          pb={2}
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

          <ArtworkCardSaveButton isSaved={!!isSaved} onPress={handleSavePress} />
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

      auction {
        bidCount
        liveBiddingStarted
        lotClosesAt
        lotWatcherCount
      }
    }

    internalID
    slug
    title
    date
    saleMessage
    isSaved
    artists(shallow: true) {
      ...ArtistListItem_artist
    }
    images {
      url(version: "large")
      width
      height
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
