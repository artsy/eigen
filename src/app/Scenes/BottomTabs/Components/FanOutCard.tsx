import { useColor } from "@artsy/palette-mobile"
import { FAVORITES_ARTWORK_OVERRIDE_HEIGHT } from "app/Scenes/BottomTabs/BottomTabsIcon"
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  FAN_OUT_DELAY,
  FAN_OUT_STAGGER,
  FLIGHT_DURATION,
  FLIGHT_STAGGER,
} from "app/Scenes/BottomTabs/Components/NewUserOnboardingCompletionAnimation"
import { ArtworkThumbnail } from "app/Scenes/InfiniteDiscovery/Components/ArtworkThumbnail"
import { NewUserOnboardingSavedArtwork } from "app/store/InfiniteDiscoveryModel"
import { MotiView } from "moti"
import { useMemo } from "react"
import { Easing } from "react-native-reanimated"

const ROTATION_START_RATIO = 0.25
const FAN_OUT_FALL_DISTANCE = 140
const FAN_OUT_FADE_DURATION = 220

const LANDED_CARD_SHADOW_OPACITY = 0.08
const LANDED_CARD_SHADOW_FADE_DURATION = 200

interface FanOutCardProps {
  artwork: NewUserOnboardingSavedArtwork
  index: number
  isLastCard: boolean
  angle: number
  rotate: string
  isFlying: boolean
  flightTranslateX: number
  flightTranslateY: number
  fanOutOffsetX: number
  fanOutOffsetY: number
  left: number
  top: number
}

export const FanOutCard: React.FC<FanOutCardProps> = ({
  artwork,
  index,
  isLastCard,
  angle,
  rotate,
  isFlying,
  flightTranslateX,
  flightTranslateY,
  fanOutOffsetX,
  fanOutOffsetY,
  left,
  top,
}) => {
  const color = useColor()

  const entranceDelay = FAN_OUT_DELAY + index * FAN_OUT_STAGGER

  const positionAnimationProps = useMemo(() => {
    const flightTiming = (easing: (t: number) => number) => ({
      type: "timing" as const,
      duration: FLIGHT_DURATION,
      delay: index * FLIGHT_STAGGER,
      easing,
    })

    return {
      from: {
        transform: [
          { translateX: -fanOutOffsetX },
          { translateY: -fanOutOffsetY - FAN_OUT_FALL_DISTANCE },
          { rotate: `${(angle * ROTATION_START_RATIO).toFixed(2)}deg` },
          { scale: 1 },
        ],
        opacity: 0,
      },
      animate: {
        transform: [
          { translateX: isFlying ? flightTranslateX : 0 },
          { translateY: isFlying ? flightTranslateY : 0 },
          { rotate: isFlying ? "0deg" : rotate },
          { scale: isFlying ? FAVORITES_ARTWORK_OVERRIDE_HEIGHT / CARD_HEIGHT : 1 },
        ],
        opacity: 1,
      },
      transition: isFlying
        ? {
            translateX: flightTiming(Easing.out(Easing.quad)),
            translateY: flightTiming(Easing.in(Easing.quad)),
            rotate: flightTiming(Easing.inOut(Easing.quad)),
            scale: flightTiming(Easing.inOut(Easing.quad)),
          }
        : {
            type: "spring" as const,
            delay: entranceDelay,
            opacity: {
              type: "timing" as const,
              duration: FAN_OUT_FADE_DURATION,
              delay: entranceDelay,
              easing: Easing.out(Easing.ease),
            },
          },
    }
  }, [
    isFlying,
    angle,
    rotate,
    flightTranslateX,
    flightTranslateY,
    fanOutOffsetX,
    fanOutOffsetY,
    index,
    entranceDelay,
  ])

  const shadowAnimationProps = useMemo(
    () => ({
      from: { opacity: 1 },
      animate: { opacity: isFlying && !isLastCard ? 0 : 1 },
      transition: isFlying
        ? {
            opacity: {
              type: "timing" as const,
              duration: LANDED_CARD_SHADOW_FADE_DURATION,
              delay: index * FLIGHT_STAGGER + FLIGHT_DURATION,
              easing: Easing.out(Easing.ease),
            },
          }
        : { type: "timing" as const, duration: 0 },
    }),
    [isFlying, isLastCard, index]
  )

  return (
    <MotiView {...positionAnimationProps} style={{ position: "absolute", left, top }}>
      <MotiView
        {...shadowAnimationProps}
        style={{
          position: "absolute",
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: (CARD_WIDTH / 88) * 14,
          backgroundColor: color("mono0"),
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: LANDED_CARD_SHADOW_OPACITY,
          shadowRadius: 6,
          elevation: 3,
        }}
      />
      <ArtworkThumbnail
        testID="completion-animation-card"
        imageUrl={artwork.url}
        blurhash={artwork.blurhash}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        shadowOpacity={0}
      />
    </MotiView>
  )
}
