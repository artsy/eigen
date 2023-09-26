import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { GlobalStore } from "app/store/GlobalStore"
import { Platform } from "react-native"

type ProgressiveOnboardingFindSavedArtworkProps = {
  tab: BottomTabType
}

export const ProgressiveOnboardingFindSavedArtwork: React.FC<
  ProgressiveOnboardingFindSavedArtworkProps
> = ({ children, tab }) => {
  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isFirstSession = GlobalStore.useAppState((state) => state.auth.sessionState.isFirstSession)

  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const profileTabProps = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.tabProps.profile
  )

  const isFindSavedArtworkDisplayable =
    !isDismissed("find-saved-artwork").status && !!profileTabProps?.savedArtwork

  if (tab !== "profile" || isFirstSession || Platform.OS === "android") {
    return <>{children}</>
  }

  const handleDismiss = () => {
    dismiss("find-saved-artwork")
  }

  return (
    <Popover
      visible={isFindSavedArtworkDisplayable}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      title={
        <Text variant="xs" color="white100" numberOfLines={1}>
          Find and edit all your Saves here
        </Text>
      }
    >
      <Flex flex={1}>{children}</Flex>
    </Popover>
  )
}
