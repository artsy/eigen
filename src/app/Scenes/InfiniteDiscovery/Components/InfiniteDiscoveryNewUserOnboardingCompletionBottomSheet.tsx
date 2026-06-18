import { Button, Flex, Image, Spacer, Text, useColor } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { GlobalStore } from "app/store/GlobalStore"
import { NewUserOnboardingSavedArtwork } from "app/store/InfiniteDiscoveryModel"
import { switchTab } from "app/system/navigation/navigate"
import { useRef } from "react"
import { View, ViewStyle } from "react-native"

const SNAP_HEIGHT = 450

const CARD_WIDTH = 95
const CARD_HEIGHT = 125
const CARD_PILE_HEIGHT = 145

const CARD_TRANSFORMS: ViewStyle["transform"][] = [
  [{ rotate: "-6deg" }, { translateX: -20 }, { translateY: 8 }],
  [{ rotate: "-3deg" }, { translateX: -10 }, { translateY: 4 }],
  [{ rotate: "0deg" }, { translateX: 0 }, { translateY: 0 }],
  [{ rotate: "3deg" }, { translateX: 10 }, { translateY: 4 }],
  [{ rotate: "6deg" }, { translateX: 20 }, { translateY: 8 }],
]

interface MiniatureCardProps {
  artwork: NewUserOnboardingSavedArtwork
  transform: ViewStyle["transform"]
}

const MiniatureCard: React.FC<MiniatureCardProps> = ({ artwork, transform }) => {
  const color = useColor()
  return (
    <View
      style={{
        position: "absolute",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 4,
        borderColor: color("mono0"),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        transform,
      }}
    >
      <Image
        src={artwork.url}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        blurhash={artwork.blurhash ?? undefined}
      />
    </View>
  )
}

export const InfiniteDiscoveryNewUserOnboardingCompletionBottomSheet: React.FC = () => {
  const color = useColor()
  const ref = useRef<BottomSheet>(null)

  const completionBottomSheetVisible = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.completionBottomSheetVisible
  )
  const savedArtworks = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingSavedArtworks
  )
  const { setIsNewUserOnboardingSession } = GlobalStore.actions.infiniteDiscovery

  if (!completionBottomSheetVisible) {
    return null
  }

  return (
    <BottomSheet
      ref={ref}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      snapPoints={[1, SNAP_HEIGHT]}
      index={1}
      backgroundStyle={{ backgroundColor: color("mono0") }}
    >
      <Flex px={2} pb={2}>
        <Flex height={CARD_PILE_HEIGHT} alignItems="center" justifyContent="center">
          {savedArtworks.map((artwork, index) => (
            <MiniatureCard
              key={artwork.internalID}
              artwork={artwork}
              transform={CARD_TRANSFORMS[index]}
            />
          ))}
        </Flex>

        <Spacer y={2} />

        <Text variant="lg-display">First five works saved!</Text>

        <Spacer y={1} />

        <Text>
          {
            "Good job, we're starting to understand what draws you in.\n\nVisit your homepage to see what we've put together so far, or keep browsing."
          }
        </Text>

        <Spacer y={2} />

        <Button
          block
          onPress={() => {
            setIsNewUserOnboardingSession(false)
            switchTab("home")
          }}
        >
          Take me home
        </Button>
      </Flex>
    </BottomSheet>
  )
}
