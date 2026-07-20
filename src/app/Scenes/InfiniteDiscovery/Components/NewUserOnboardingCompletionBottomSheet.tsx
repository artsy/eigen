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
import { useCallback } from "react"
import { View } from "react-native"

const REFERENCE_WIDTH = 350
const CARD_WIDTH = 85
const CARD_HEIGHT = 106
const SPREAD_ANGLE = 56
const ARC_RADIUS = 260

const CARD_COUNT = 5
const toRad = (deg: number) => (deg * Math.PI) / 180

const FAN_CONFIGS = Array.from({ length: CARD_COUNT }, (_, i) => {
  const angle = ((i - Math.floor(CARD_COUNT / 2)) * SPREAD_ANGLE) / (CARD_COUNT - 1)
  return {
    left: REFERENCE_WIDTH / 2 + ARC_RADIUS * Math.sin(toRad(angle)) - CARD_WIDTH / 2,
    top: ARC_RADIUS * (1 - Math.cos(toRad(angle))),
    rotate: `${angle.toFixed(2)}deg`,
  }
})

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
            {savedArtworks.map((artwork, index) => {
              const config = FAN_CONFIGS[index]
              return (
                <ArtworkThumbnail
                  key={artwork.internalID}
                  imageUrl={artwork.url}
                  blurhash={artwork.blurhash}
                  width={CARD_WIDTH * scale}
                  height={CARD_HEIGHT * scale}
                  rotate={config.rotate}
                  style={{
                    position: "absolute",
                    left: config.left * scale,
                    top: config.top * scale,
                  }}
                />
              )
            })}
          </View>

          <Spacer y={2} />

          <Flex gap={1} alignItems="center">
            <Text variant="lg-display" textAlign="center">
              Five works is all it takes to start.
            </Text>
            <Text variant="sm" textAlign="center">
              We're beginning to see what moves you.
            </Text>
            <Text variant="xs" textAlign="center">
              Visit your For You page, or stay and keep exploring.
            </Text>
          </Flex>

          <Spacer y={2} />

          <Flex gap={1}>
            <Button block variant="outline" onPress={handleContinueBrowsing}>
              Continue Browsing
            </Button>

            <Button block variant="fillDark" onPress={handleTakeMeHome}>
              Go to home
            </Button>
          </Flex>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
