import { Button, Flex, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { ArtworkThumbnail } from "app/Scenes/InfiniteDiscovery/Components/ArtworkThumbnail"
import { useOnboardingTracking } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { MotiView } from "moti"
import { useCallback } from "react"
import { View } from "react-native"

const REFERENCE_WIDTH = 350
const CARD_WIDTH = 85
const CARD_HEIGHT = 106
const SPREAD_ANGLE = 56
const ARC_RADIUS = 260
const FAN_OUT_DELAY = 1000
const ROTATION_START_RATIO = 0.25

const CARD_COUNT = 5
const toRad = (deg: number) => (deg * Math.PI) / 180

const FAN_CONFIGS = Array.from({ length: CARD_COUNT }, (_, i) => {
  const angle = ((i - Math.floor(CARD_COUNT / 2)) * SPREAD_ANGLE) / (CARD_COUNT - 1)
  return {
    angle,
    left: REFERENCE_WIDTH / 2 + ARC_RADIUS * Math.sin(toRad(angle)) - CARD_WIDTH / 2,
    top: ARC_RADIUS * (1 - Math.cos(toRad(angle))),
    rotate: `${angle.toFixed(2)}deg`,
  }
})
const FAN_MIDDLE_CARD_CONFIG = FAN_CONFIGS[Math.floor(CARD_COUNT / 2)]

const FAN_CONTAINER_HEIGHT = ARC_RADIUS * (1 - Math.cos(toRad(SPREAD_ANGLE / 2))) + CARD_HEIGHT + 10

export const NewUserOnboardingCompletionBottomSheet: React.FC = () => {
  const { width: screenWidth, safeAreaInsets } = useScreenDimensions()
  const scale = (screenWidth - 40) / REFERENCE_WIDTH

  const newUserOnboardingCompletionBottomSheetVisible = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingCompletionBottomSheetVisible
  )
  const isNewUserOnboardingSession =
    GlobalStore.useAppState((state) => state.onboarding.onboardingState) === "incomplete"
  const savedArtworks = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingGoalSnapshot
  )
  const newUserOnboardingSavedArtworkCount = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingSavedArtworks.length
  )
  const { setOnboardingState } = GlobalStore.actions.onboarding
  const { setNewUserOnboardingCompletionBottomSheetVisible } = GlobalStore.actions.infiniteDiscovery
  const { trackCompletedOnboarding } = useOnboardingTracking()

  const handleContinueBrowsing = () => {
    setNewUserOnboardingCompletionBottomSheetVisible(false)
  }

  const handleTakeMeHome = () => {
    trackCompletedOnboarding()
    if (newUserOnboardingSavedArtworkCount >= 1) {
      GlobalStore.actions.progressiveOnboarding.setDeferHomeTooltipsThisSession(true)
    }
    setOnboardingState("complete")
    setNewUserOnboardingCompletionBottomSheetVisible(false)
  }

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="none"
        opacity={0.5}
        style={[props.style, { backgroundColor: "rgb(229,229,229)" }]}
      />
    ),
    []
  )

  const visible = newUserOnboardingCompletionBottomSheetVisible && isNewUserOnboardingSession

  return (
    <AutomountedBottomSheetModal
      visible={visible}
      closeOnBackdropClick={false}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      handleComponent={null}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView>
        <Flex px={2} pt={2} style={{ paddingBottom: safeAreaInsets.bottom + 16 }}>
          <View style={{ height: FAN_CONTAINER_HEIGHT * scale, width: REFERENCE_WIDTH * scale }}>
            {savedArtworks.slice(0, CARD_COUNT).map((artwork, index) => {
              const config = FAN_CONFIGS[index]
              return (
                // `style` sets the card's final fanned-out position; `from`/`animate` offset it
                // back to the middle card's position (with a proportional rotation) and animate
                // that offset down to zero, so the card appears to travel from the middle of the
                // fan out to its final spot while slightly rotating.
                <MotiView
                  key={artwork.internalID}
                  from={{
                    transform: [
                      { translateX: (FAN_MIDDLE_CARD_CONFIG.left - config.left) * scale },
                      { translateY: (FAN_MIDDLE_CARD_CONFIG.top - config.top) * scale },
                      { rotate: `${(config.angle * ROTATION_START_RATIO).toFixed(2)}deg` },
                    ],
                  }}
                  animate={{
                    transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: config.rotate }],
                  }}
                  transition={{
                    type: "spring",
                    delay: FAN_OUT_DELAY,
                  }}
                  style={{
                    position: "absolute",
                    left: config.left * scale,
                    top: config.top * scale,
                  }}
                >
                  <ArtworkThumbnail
                    imageUrl={artwork.url}
                    blurhash={artwork.blurhash}
                    width={CARD_WIDTH * scale}
                    height={CARD_HEIGHT * scale}
                  />
                </MotiView>
              )
            })}
          </View>

          <Spacer y={2} />

          <Flex gap={1} alignItems="center">
            <Text variant="lg-display" textAlign="center" weight="medium">
              First five saved: We’re beginning to understand your taste.
            </Text>

            <Text variant="xs" textAlign="center">
              Go to Home or keep exploring works.
            </Text>
          </Flex>

          <Spacer y={2} />

          <Flex gap={1}>
            <Button block variant="outline" onPress={handleContinueBrowsing}>
              See More Works
            </Button>

            <Button block variant="fillDark" onPress={handleTakeMeHome}>
              Take Me Home
            </Button>
          </Flex>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
