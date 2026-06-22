import { Button, Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import { ArtworkThumbnail } from "app/Scenes/InfiniteDiscovery/Components/ArtworkThumbnail"
import { GlobalStore } from "app/store/GlobalStore"
import { useCallback, useRef } from "react"
import { useWindowDimensions, View } from "react-native"

const SNAP_HEIGHT = 450

const REFERENCE_WIDTH = 350
const FAN_CONTAINER_HEIGHT_BASE = 165

const FAN_CARD_CONFIGS = [
  { left: 24.5, top: 40.5, width: 86.5, height: 108, rotate: "-27.46deg" },
  { left: 71, top: 12, width: 87.5, height: 106, rotate: "-13.56deg" },
  { left: 126.5, top: 0, width: 88.5, height: 105, rotate: "0deg" },
  { left: 183.5, top: 12, width: 87.5, height: 106, rotate: "13.56deg" },
  { left: 239.5, top: 40.5, width: 86.5, height: 108, rotate: "27.46deg" },
]

export const NewUserOnboardingCompletionBottomSheet: React.FC = () => {
  const color = useColor()
  const ref = useRef<BottomSheet>(null)
  const { width: screenWidth } = useWindowDimensions()
  const scale = (screenWidth - 40) / REFERENCE_WIDTH

  const completionBottomSheetVisible = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.completionBottomSheetVisible
  )
  const isNewUserOnboardingSession = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.isNewUserOnboardingSession
  )
  const savedArtworks = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingSavedArtworks
  )
  const { setOnboardingState } = GlobalStore.actions.onboarding

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

  if (!completionBottomSheetVisible || !isNewUserOnboardingSession) {
    return null
  }

  return (
    <BottomSheet
      ref={ref}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      handleComponent={null}
      backdropComponent={renderBackdrop}
      snapPoints={[SNAP_HEIGHT]}
      index={0}
      backgroundStyle={{ backgroundColor: color("mono0") }}
    >
      <Flex px={2} pb={2} pt={2}>
        <View style={{ height: FAN_CONTAINER_HEIGHT_BASE * scale, width: REFERENCE_WIDTH * scale }}>
          {savedArtworks.map((artwork, index) => {
            const config = FAN_CARD_CONFIGS[index]
            return (
              <ArtworkThumbnail
                key={artwork.internalID}
                imageUrl={artwork.url}
                blurhash={artwork.blurhash}
                width={config.width * scale}
                height={config.height * scale}
                rotate={config.rotate}
                style={{ position: "absolute", left: config.left * scale, top: config.top * scale }}
              />
            )
          })}
        </View>

        <Spacer y={2} />

        <Flex gap={1} alignItems="center">
          <Text variant="lg-display" textAlign="center">
            First five works saved!
          </Text>
          <Text variant="sm" textAlign="center">
            We're starting to understand what draws you in.
          </Text>
          <Text variant="xs" textAlign="center">
            Visit your homepage to see what we've put together so far, or keep browsing.
          </Text>
        </Flex>

        <Spacer y={2} />

        <Button
          block
          variant="fillDark"
          onPress={() => {
            setOnboardingState("complete")
          }}
        >
          Take me home
        </Button>
      </Flex>
    </BottomSheet>
  )
}
