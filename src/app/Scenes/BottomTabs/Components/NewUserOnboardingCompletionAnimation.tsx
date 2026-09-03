import { Flex, useColor, useScreenDimensions } from "@artsy/palette-mobile"
import { FanOutCard } from "app/Scenes/BottomTabs/Components/FanOutCard"
import { GlobalStore } from "app/store/GlobalStore"
import { NewUserOnboardingSavedArtwork } from "app/store/InfiniteDiscoveryModel"
import { MotiView } from "moti"
import { useEffect, useMemo, useState } from "react"
import { Easing, useReducedMotion } from "react-native-reanimated"

export const CARD_COUNT = 5

export const CARD_WIDTH = 99
export const CARD_HEIGHT = 124
const SPREAD_ANGLE = 56
const ARC_RADIUS = 260

export const FAN_OUT_DELAY = 150
export const FAN_OUT_STAGGER = 90
const FAN_OUT_FALL_DURATION = 450
const FAN_OUT_HOLD_DURATION = 500

const HOME_READY_FALLBACK_TIMEOUT = 4000
const POST_HOME_READY_SETTLE_DELAY = 500

export const FLIGHT_STAGGER = 140
export const FLIGHT_DURATION = 600

const PILE_HOLD_DURATION = 400

const SCRIM_OPACITY = 0.55
const SCRIM_FADE_IN_DURATION = 350

const toRad = (deg: number) => (deg * Math.PI) / 180

const FAN_CONFIGS = Array.from({ length: CARD_COUNT }, (_, i) => {
  const angle = ((i - Math.floor(CARD_COUNT / 2)) * SPREAD_ANGLE) / (CARD_COUNT - 1)
  return {
    angle,
    offsetX: ARC_RADIUS * Math.sin(toRad(angle)),
    offsetY: ARC_RADIUS * (1 - Math.cos(toRad(angle))),
    rotate: `${angle.toFixed(2)}deg`,
  }
})

type AnimationPhase = "idle" | "waiting_for_home" | "fan_out" | "flying" | "done"

export const NewUserOnboardingCompletionAnimation: React.FC = () => {
  const hasPendingCompletionAnimation = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.hasPendingCompletionAnimation
  )
  const newUserOnboardingGoalSnapshot = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingGoalSnapshot
  )
  const favoritesTabIconPosition = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.favoritesTabIconPosition
  )
  const isHomeReady = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.isHomeViewReadyForOnboardingCompletionAnimation
  )
  const isReducedMotionEnabled = useReducedMotion()
  const { width: screenWidth, height: screenHeight } = useScreenDimensions()
  const color = useColor()

  const [phase, setPhase] = useState<AnimationPhase>("idle")
  const [artworks, setArtworks] = useState<NewUserOnboardingSavedArtwork[]>([])

  const landingDuration = useMemo(
    () => (artworks.length - 1) * FLIGHT_STAGGER + FLIGHT_DURATION,
    [artworks.length]
  )

  useEffect(() => {
    if (!hasPendingCompletionAnimation) {
      return
    }

    GlobalStore.actions.infiniteDiscovery.setHasPendingCompletionAnimation(false)

    if (isReducedMotionEnabled || newUserOnboardingGoalSnapshot.length === 0) {
      return
    }

    setArtworks(newUserOnboardingGoalSnapshot.slice(0, CARD_COUNT))
    setPhase("waiting_for_home")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPendingCompletionAnimation])

  useEffect(() => {
    if (phase !== "waiting_for_home") {
      return
    }

    const timeout = setTimeout(
      () => setPhase("fan_out"),
      isHomeReady ? POST_HOME_READY_SETTLE_DELAY : HOME_READY_FALLBACK_TIMEOUT
    )
    return () => clearTimeout(timeout)
  }, [phase, isHomeReady])

  useEffect(() => {
    if (phase !== "fan_out") {
      return
    }

    const totalFanOutDuration =
      FAN_OUT_DELAY +
      (artworks.length - 1) * FAN_OUT_STAGGER +
      FAN_OUT_FALL_DURATION +
      FAN_OUT_HOLD_DURATION

    const timeout = setTimeout(() => setPhase("flying"), totalFanOutDuration)
    return () => clearTimeout(timeout)
  }, [phase, artworks.length])

  useEffect(() => {
    if (phase !== "flying") {
      return
    }

    const setOverrideTimeout = setTimeout(() => {
      const mostRecentlySaved = artworks[artworks.length - 1]
      if (mostRecentlySaved) {
        GlobalStore.actions.bottomTabs.setFavoritesTabArtworkOverride({
          url: mostRecentlySaved.url,
          blurhash: mostRecentlySaved.blurhash,
        })
      }
    }, landingDuration)

    const clearOverlayTimeout = setTimeout(() => {
      setPhase("done")
      GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingGoalReached(false)
    }, landingDuration + PILE_HOLD_DURATION)

    return () => {
      clearTimeout(setOverrideTimeout)
      clearTimeout(clearOverlayTimeout)
    }
  }, [phase, artworks, landingDuration])

  if (
    phase === "idle" ||
    phase === "waiting_for_home" ||
    phase === "done" ||
    !favoritesTabIconPosition
  ) {
    return null
  }

  const centerX = screenWidth / 2
  const centerY = screenHeight * 0.4
  const iconCenterX = favoritesTabIconPosition.x + favoritesTabIconPosition.width / 2
  const iconCenterY = favoritesTabIconPosition.y + favoritesTabIconPosition.height / 2

  return (
    <Flex
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ position: "absolute", width: "100%", height: "100%" }}
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: phase === "fan_out" ? SCRIM_OPACITY : 0 }}
        transition={{
          type: "timing",
          duration: phase === "fan_out" ? SCRIM_FADE_IN_DURATION : landingDuration,
          easing: Easing.out(Easing.ease),
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: favoritesTabIconPosition.y,
          backgroundColor: color("mono0"),
        }}
      />
      {artworks.map((artwork, index) => {
        const config = FAN_CONFIGS[index]
        const cardCenterX = centerX + config.offsetX
        const cardCenterY = centerY + config.offsetY

        return (
          <FanOutCard
            key={artwork.internalID}
            artwork={artwork}
            index={index}
            isLastCard={index === artworks.length - 1}
            angle={config.angle}
            rotate={config.rotate}
            isFlying={phase === "flying"}
            flightTranslateX={iconCenterX - cardCenterX}
            flightTranslateY={iconCenterY - cardCenterY}
            left={cardCenterX - CARD_WIDTH / 2}
            top={cardCenterY - CARD_HEIGHT / 2}
          />
        )
      })}
    </Flex>
  )
}
