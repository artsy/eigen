import { Button, Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import { ArtworkThumbnail } from "app/Scenes/InfiniteDiscovery/Components/ArtworkThumbnail"
import { GlobalStore } from "app/store/GlobalStore"
import { useCallback, useEffect, useRef } from "react"
import { Image, useWindowDimensions, View } from "react-native"

const SNAP_HEIGHT = 450

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
  const color = useColor()
  const ref = useRef<BottomSheet>(null)
  const { width: screenWidth } = useWindowDimensions()
  const scale = (screenWidth - 40) / REFERENCE_WIDTH

  const newUserOnboardingCompletionBottomSheetVisible = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingCompletionBottomSheetVisible
  )
  const isNewUserOnboardingSession = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.isNewUserOnboardingSession
  )
  const savedArtworks = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingSavedArtworks
  )
  const { setOnboardingState } = GlobalStore.actions.onboarding

  useEffect(() => {
    const latest = savedArtworks[savedArtworks.length - 1]
    if (latest) {
      Image.prefetch(latest.url)
    }
  }, [savedArtworks])

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

  if (!newUserOnboardingCompletionBottomSheetVisible || !isNewUserOnboardingSession) {
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
