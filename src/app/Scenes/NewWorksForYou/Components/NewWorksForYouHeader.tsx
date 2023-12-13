import { Flex, FullWidthIcon, GridIcon, Text } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { pluralize } from "app/utils/pluralize"
import { MotiPressable } from "moti/interactions"
import { LayoutAnimation } from "react-native"
import { isTablet } from "react-native-device-info"

const ICON_SIZE = 28

export const NewWorksForYouHeaderComponent: React.FC<{
  artworksCount: number
}> = ({ artworksCount }) => {
  const setNewWorksForYouViewOption = GlobalStore.actions.userPrefs.setNewWorksForYouViewOption
  const enableNewWorksForYouFeed = useFeatureFlag("AREnableNewWorksForYouScreenFeed")

  const newWorksForYouViewOption = GlobalStore.useAppState(
    (state) => state.userPrefs.newWorksForYouViewOption
  )

  return (
    <Flex my={1}>
      <Text variant="lg-display">New Works For You</Text>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="xs" mt={1}>
          {artworksCount} {pluralize("Artwork", artworksCount)}
        </Text>
        {!!enableNewWorksForYouFeed && !isTablet() && (
          <MotiPressable
            onPress={() => {
              setNewWorksForYouViewOption(newWorksForYouViewOption === "list" ? "grid" : "list")
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            }}
          >
            {newWorksForYouViewOption === "list" ? (
              <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} />
            ) : (
              <GridIcon height={ICON_SIZE} width={ICON_SIZE} />
            )}
          </MotiPressable>
        )}
      </Flex>
    </Flex>
  )
}
