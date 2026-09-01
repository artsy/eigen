import { Image, useScreenDimensions } from "@artsy/palette-mobile"
import { Portal } from "@gorhom/portal"
import { useSaveFlightPhase } from "app/Scenes/InfiniteDiscovery/hooks/useSaveFlightPhase"
import { NewUserOnboardingSavedArtwork } from "app/store/InfiniteDiscoveryModel"
import { BLURHASH_DECODE_ASYNC } from "app/utils/blurhashDecodeAsync"
import { MotiView } from "moti"
import { useMemo } from "react"
import { Easing } from "react-native-reanimated"

export const INFINITE_DISCOVERY_SAVE_ANIMATION_PORTAL_HOST = "InfiniteDiscovery-SaveAnimation"

const CARD_WIDTH = 50
const CARD_HEIGHT = 66
const CARD_BORDER_WIDTH = 5
const CARD_BORDER_RADIUS = 9

const POP_OVERSHOOT_DURATION = 90
const POP_SETTLE_DURATION = 150
const POP_DURATION = POP_OVERSHOOT_DURATION + POP_SETTLE_DURATION
const FADE_IN_DURATION = POP_OVERSHOOT_DURATION
const FLIGHT_DURATION = 500
const FADE_OUT_DURATION = 125
const OPACITY_DROP_DURATION = 75
const FADE_OUT_SCALE = 0.35

const BASE_SCALE = 1
const POP_START_SCALE = 0.4
const POP_OVERSHOOT_SCALE = 1.1

const BADGE_APPROXIMATE_LEFT = 20

interface InfiniteDiscoverySaveFlightAnimationProps {
  artwork: NewUserOnboardingSavedArtwork | null
  onComplete: () => void
}

export const InfiniteDiscoverySaveFlightAnimation: React.FC<
  InfiniteDiscoverySaveFlightAnimationProps
> = ({ artwork, onComplete }) => {
  const { width: screenWidth, height: screenHeight, safeAreaInsets } = useScreenDimensions()

  if (!artwork) {
    return null
  }

  const startLeft = screenWidth / 2 - CARD_WIDTH / 2
  const startTop = screenHeight / 2 - CARD_HEIGHT / 2
  const endLeft = BADGE_APPROXIMATE_LEFT
  const endTop = safeAreaInsets.top

  return (
    <Portal hostName={INFINITE_DISCOVERY_SAVE_ANIMATION_PORTAL_HOST}>
      <SaveFlightCard
        key={artwork.internalID}
        imageUrl={artwork.url}
        blurhash={artwork.blurhash}
        startLeft={startLeft}
        startTop={startTop}
        translateX={endLeft - startLeft}
        translateY={endTop - startTop}
        onComplete={onComplete}
      />
    </Portal>
  )
}

interface SaveFlightCardProps {
  imageUrl: string
  blurhash?: string | null
  startLeft: number
  startTop: number
  translateX: number
  translateY: number
  onComplete: () => void
}

const POP_IN_SCALE_SEQUENCE = [
  // overshoot past full size
  {
    value: POP_OVERSHOOT_SCALE,
    type: "timing" as const,
    duration: POP_OVERSHOOT_DURATION,
    easing: Easing.out(Easing.ease),
  },
  // settle back down to full size
  {
    value: BASE_SCALE,
    type: "timing" as const,
    duration: POP_SETTLE_DURATION,
    easing: Easing.out(Easing.ease),
  },
]

const SaveFlightCard: React.FC<SaveFlightCardProps> = ({
  imageUrl,
  blurhash,
  startLeft,
  startTop,
  translateX,
  translateY,
  onComplete,
}) => {
  const phase = useSaveFlightPhase({
    popInDuration: POP_DURATION,
    flightDuration: FLIGHT_DURATION - FADE_OUT_DURATION,
    fadeOutDuration: FADE_OUT_DURATION,
    onComplete,
  })

  const isPoppingIn = phase === "pop_in"
  const isFadingOut = phase === "fade_out"

  // stable reference while phase is unchanged, so unrelated re-renders don't restart the sequence
  const flightAnimationProps = useMemo(
    () => ({
      from: {
        transform: [{ translateX: 0 }, { translateY: 0 }, { scale: POP_START_SCALE }],
        opacity: 0,
      },
      animate: {
        transform: [
          { translateX: isPoppingIn ? 0 : translateX },
          { translateY: isPoppingIn ? 0 : translateY },
          {
            scale: isPoppingIn ? POP_IN_SCALE_SEQUENCE : isFadingOut ? FADE_OUT_SCALE : BASE_SCALE,
          },
        ],
        opacity: isFadingOut ? 0 : 1,
      },
      transition: {
        translateY: {
          type: "timing" as const,
          duration: FLIGHT_DURATION,
          easing: Easing.in(Easing.quad),
        },
        translateX: {
          type: "timing" as const,
          duration: FLIGHT_DURATION,
          easing: Easing.out(Easing.quad),
        },
        scale: {
          type: "timing" as const,
          duration: FADE_OUT_DURATION,
          easing: Easing.inOut(Easing.quad),
        },
        opacity: {
          type: "timing" as const,
          duration: isFadingOut ? OPACITY_DROP_DURATION : FADE_IN_DURATION,
          // stays fully opaque while shrinking, then only fades in the final slice of fade_out
          delay: isFadingOut ? FADE_OUT_DURATION - OPACITY_DROP_DURATION : 0,
        },
      },
    }),
    [isPoppingIn, isFadingOut, translateX, translateY]
  )

  return (
    <MotiView
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...flightAnimationProps}
      style={{
        position: "absolute",
        left: startLeft,
        top: startTop,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: CARD_BORDER_RADIUS,
        borderWidth: CARD_BORDER_WIDTH,
        borderColor: "white",
        overflow: "hidden",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Image
        src={imageUrl}
        blurhash={blurhash ?? undefined}
        blurhashDecodeAsync={BLURHASH_DECODE_ASYNC}
        width={CARD_WIDTH - CARD_BORDER_WIDTH * 2}
        height={CARD_HEIGHT - CARD_BORDER_WIDTH * 2}
      />
    </MotiView>
  )
}
