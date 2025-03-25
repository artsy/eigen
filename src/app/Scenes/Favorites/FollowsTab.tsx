import {
  ArrowDownIcon,
  Flex,
  Join,
  RadioButton,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { FollowedArtistsQueryRenderer } from "app/Scenes/Favorites/Components/FollowedArtists"
import { FollowedGalleriesQueryRenderer } from "app/Scenes/Favorites/Components/FollowedGalleries"
import { FollowedShowsQueryRenderer } from "app/Scenes/Favorites/Components/FollowedShows"
import { SNAP_POINTS } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { useState } from "react"
import Haptic from "react-native-haptic-feedback"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type FollowOption = "artists" | "shows" | "galleries"

const FOLLOW_OPTIONS: {
  value: FollowOption
  label: string
}[] = [
  {
    value: "artists",
    label: "Artists",
  },
  {
    value: "shows",
    label: "Shows",
  },
  {
    value: "galleries",
    label: "Galleries",
  },
]

export const FollowsTab = () => {
  const [followOption, setfollowOption] = useState<FollowOption>("artists")
  const { bottom } = useSafeAreaInsets()

  const [showBottomSheet, setShowBottomSheet] = useState(false)

  return (
    <Flex flex={1}>
      <Flex p={2}>
        <Touchable
          haptic
          onPress={() => {
            Haptic.trigger("impactLight")
            setShowBottomSheet(true)
          }}
        >
          <Flex flexDirection="row" alignItems="center">
            <Text variant="sm-display" mr={0.5}>
              {FOLLOW_OPTIONS.find(({ value }) => value === followOption)?.label}
            </Text>
            <ArrowDownIcon />
          </Flex>
        </Touchable>
      </Flex>

      {followOption === "artists" && <FollowedArtistsQueryRenderer />}
      {followOption === "shows" && <FollowedShowsQueryRenderer />}
      {followOption === "galleries" && <FollowedGalleriesQueryRenderer />}

      <AutomountedBottomSheetModal
        visible={showBottomSheet}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing
        onDismiss={() => {
          setShowBottomSheet(false)
        }}
        name="FollowsBottomSheet"
      >
        <BottomSheetScrollView keyboardShouldPersistTaps="always">
          <Flex p={2}>
            <Text variant="lg-display" mb={1}>
              Follows
            </Text>

            <Spacer y={2} />

            <Join separator={<Spacer y={2} />}>
              {FOLLOW_OPTIONS.map(({ value, label }) => (
                <RadioButton
                  key={value}
                  block
                  onPress={() => {
                    setfollowOption(value)
                    // Dismiss after a short delay to make sure the user can verify their choice
                    setTimeout(() => {
                      setShowBottomSheet(false)
                    }, 200)
                  }}
                  selected={followOption === value}
                  text={label}
                />
              ))}
            </Join>
          </Flex>

          {/* This is a spacer to make sure the bottom sheet is not covered by the system bottom insets */}
          <Spacer y={`${bottom}px`} />
        </BottomSheetScrollView>
      </AutomountedBottomSheetModal>
    </Flex>
  )
}
