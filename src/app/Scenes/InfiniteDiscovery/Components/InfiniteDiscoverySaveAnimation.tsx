import { Image } from "@artsy/palette-mobile"
import { useEffect } from "react"
import { Modal, StyleSheet, useWindowDimensions } from "react-native"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const CARD_W = 56
const CARD_H = 75

// Screen.Header height (44px palette-mobile standard) + Flex mb={1} (4px) beneath it
const HEADER_HEIGHT = 44
const HEADER_MARGIN_BOTTOM = 4
// ChevronDownIcon: left padding 16px + half of ~18px default icon size
const CHEVRON_CENTER_X = 25
// Artist section inside the artwork card: p={2} + ArtistListItemContainer ≈ 60px
const ARTIST_SECTION_HEIGHT = 60

// Phase durations (ms)
const T_FADE_IN = 200
const T_DRIFT = 550
const T_FADE_OUT = 200

const easeInOut = Easing.inOut(Easing.cubic)

interface InfiniteDiscoverySaveAnimationProps {
  image?: { url: string; blurhash?: string | null }
  onReachChevron?: () => void
  onComplete?: () => void
}

export const InfiniteDiscoverySaveAnimation: React.FC<InfiniteDiscoverySaveAnimationProps> = ({
  image,
  onReachChevron,
  onComplete,
}) => {
  const { width: W, height: H } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  // --- Position calculations (all relative to screen center) ---

  // ChevronDown icon: top-left corner of Screen.Header, which starts at insets.top
  // because Screen.Body has marginTop: insets.top.
  const chevronCenterY = insets.top + HEADER_HEIGHT / 2
  const endX = CHEVRON_CENTER_X - W / 2
  const endY = chevronCenterY - H / 2

  // Artwork image center: below header + margin, below artist section, halfway into image area
  const imageAreaHeight = H * 0.55
  const artworkImageCenterY =
    insets.top + HEADER_HEIGHT + HEADER_MARGIN_BOTTOM + ARTIST_SECTION_HEIGHT + imageAreaHeight / 2
  const startX = 0
  const startY = artworkImageCenterY - H / 2

  // --- Shared values ---
  const translateX = useSharedValue(startX)
  const translateY = useSharedValue(startY)
  const opacity = useSharedValue(0)

  useEffect(() => {
    const done = () => onComplete?.()
    const touchChevron = () => onReachChevron?.()

    opacity.set(() =>
      withSequence(
        withTiming(1, { duration: T_FADE_IN }),
        withTiming(1, { duration: T_DRIFT }),
        withTiming(0, { duration: T_FADE_OUT }, () => runOnJS(done)())
      )
    )

    translateX.set(() =>
      withSequence(
        withTiming(startX, { duration: T_FADE_IN }),
        withTiming(endX, { duration: T_DRIFT, easing: easeInOut }),
        withTiming(endX, { duration: T_FADE_OUT })
      )
    )

    translateY.set(() =>
      withSequence(
        withTiming(startY, { duration: T_FADE_IN }),
        withTiming(endY, { duration: T_DRIFT, easing: easeInOut }, () => {
          runOnJS(touchChevron)()
        }),
        withTiming(endY, { duration: T_FADE_OUT })
      )
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateX: translateX.get() }, { translateY: translateY.get() }],
  }))

  return (
    <Modal transparent statusBarTranslucent animationType="none" visible>
      <Animated.View style={[styles.card, style]} pointerEvents="none">
        {!!image && (
          <Image
            src={image.url}
            blurhash={image.blurhash ?? undefined}
            width={CARD_W}
            height={CARD_H}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        )}
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: CARD_W,
    height: CARD_H,
    top: "50%",
    left: "50%",
    marginTop: -CARD_H / 2,
    marginLeft: -CARD_W / 2,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "white",
    backgroundColor: "#C8A882", // shown while image loads, or as fallback
    overflow: "hidden", // clips the artwork image to the card's rounded corners
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
