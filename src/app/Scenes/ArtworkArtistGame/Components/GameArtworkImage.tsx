import { HeartFillIcon } from "@artsy/icons/native"
import { Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { useSaveArtworkToArtworkLists_artwork$key } from "__generated__/useSaveArtworkToArtworkLists_artwork.graphql"
import { ArtworkSaveIconWrapper } from "app/Components/ArtworkGrids/ArtworkSaveIconWrapper"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Haptic from "react-native-haptic-feedback"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"

interface GameArtworkImageProps {
  imageURL: string
  width: number
  height: number
  blurhash?: string | null
  href?: string | null
  artworkRef: useSaveArtworkToArtworkLists_artwork$key
}

export const GameArtworkImage: React.FC<GameArtworkImageProps> = ({
  imageURL,
  width,
  height,
  blurhash,
  href,
  artworkRef,
}) => {
  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artworkRef,
    saveToDefaultCollectionOnly: true,
  })

  const burstOpacity = useSharedValue(0)

  const burstStyles = useAnimatedStyle(() => ({ opacity: burstOpacity.value }))

  const playBurst = () => {
    burstOpacity.value = withSequence(
      withTiming(1, { duration: 200, easing: Easing.linear }),
      withDelay(400, withTiming(0, { duration: 300, easing: Easing.linear }))
    )
  }

  // Toggles the save state — used by the heart button.
  const handleSavePress = () => {
    if (!isSaved) {
      Haptic.trigger("impactLight")
      playBurst()
    }
    saveArtworkToLists()
  }

  // Double tap only ever saves (never un-saves), matching Infinite Discovery.
  const handleDoubleTapSave = () => {
    if (isSaved) return
    Haptic.trigger("impactLight")
    playBurst()
    saveArtworkToLists()
  }

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onEnd(() => {
      runOnJS(handleDoubleTapSave)()
    })

  return (
    <Flex alignItems="center">
      <GestureDetector gesture={doubleTap}>
        <Flex width={width} height={height}>
          {/* performResize=false so the fetched URL matches the one we prefetch (the raw
              "large" version), guaranteeing a cache hit and avoiding on-the-fly resizing. */}
          <Image
            src={imageURL}
            width={width}
            height={height}
            blurhash={blurhash ?? undefined}
            performResize={false}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: "absolute",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
              },
              burstStyles,
            ]}
          >
            <HeartFillIcon height={80} width={80} fill="mono0" />
          </Animated.View>

          <Flex position="absolute" top={10} right={10}>
            <Touchable
              accessibilityRole="button"
              accessibilityLabel={isSaved ? "Saved" : "Save artwork"}
              onPress={handleSavePress}
            >
              <Flex
                flexDirection="row"
                alignItems="center"
                backgroundColor="mono0"
                borderRadius={20}
                borderWidth={1}
                borderColor="mono10"
                px={1}
                py={0.5}
              >
                <ArtworkSaveIconWrapper isSaved={!!isSaved} testID="game-artwork-save-icon" />
                <Text variant="xs" ml={0.5}>
                  {isSaved ? "Saved" : "Save"}
                </Text>
              </Flex>
            </Touchable>
          </Flex>
        </Flex>
      </GestureDetector>

      <Flex flexDirection="row" alignItems="center" mt={1} gap={1}>
        <Text variant="xs" color="mono60">
          Double tap the artwork to save it
        </Text>
        {!!href && (
          <RouterLink to={href} accessibilityRole="link" testID="game-view-artwork-link">
            <Text variant="xs" color="blue100">
              View artwork
            </Text>
          </RouterLink>
        )}
      </Flex>
    </Flex>
  )
}
