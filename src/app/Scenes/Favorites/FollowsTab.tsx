import { OwnerType } from "@artsy/cohesion"
import {
  ChevronIcon,
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
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import {
  useFavoritesScrenTracking,
  useFavoritesTracking,
} from "app/Scenes/Favorites/useFavoritesTracking"
import { SNAP_POINTS } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import Haptic from "react-native-haptic-feedback"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type FollowOption = "artists" | "shows" | "galleries"

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

export const FollowOptionPicker: React.FC<{}> = () => {
  const { followOption } = FavoritesContextStore.useStoreState((state) => state)
  const { setShowFollowsBottomSheet } = FavoritesContextStore.useStoreActions((actions) => actions)

  return (
    <Flex px={2} pb={2}>
      <Touchable
        haptic
        onPress={() => {
          Haptic.trigger("impactLight")
          setShowFollowsBottomSheet(true)
        }}
      >
        <Flex flexDirection="row" alignItems="center">
          <Text variant="sm-display" mr={0.5}>
            {FOLLOW_OPTIONS.find(({ value }) => value === followOption)?.label}
          </Text>
          <ChevronIcon
            direction="down"
            style={{
              // We are manually adding a tiny padding here to make sure that the arrow is centered
              // This is a workaround our icon
              marginTop: 2,
            }}
          />
        </Flex>
      </Touchable>
    </Flex>
  )
}

export const FollowsTab = () => {
  const { bottom } = useSafeAreaInsets()

  useFavoritesScrenTracking(OwnerType.favoritesFollows)

  const { showFollowsBottomSheet, followOption } = FavoritesContextStore.useStoreState(
    (state) => state
  )
  const { setShowFollowsBottomSheet, setFollowOption } = FavoritesContextStore.useStoreActions(
    (actions) => actions
  )

  const { trackSelectedFromDrawer } = useFavoritesTracking()

  return (
    <Flex flex={1}>
      {followOption === "artists" && <FollowedArtistsQueryRenderer />}
      {followOption === "shows" && <FollowedShowsQueryRenderer />}
      {followOption === "galleries" && <FollowedGalleriesQueryRenderer />}

      <AutomountedBottomSheetModal
        visible={showFollowsBottomSheet}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing
        onDismiss={() => {
          setShowFollowsBottomSheet(false)
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
                  textVariant="sm-display"
                  onPress={() => {
                    setFollowOption(value)
                    // Dismiss after a short delay to make sure the user can verify their choice
                    setTimeout(() => {
                      setShowFollowsBottomSheet(false)
                    }, 200)
                    trackSelectedFromDrawer(value)
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
