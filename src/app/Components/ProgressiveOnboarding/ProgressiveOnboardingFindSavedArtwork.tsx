import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { GlobalStore } from "app/store/GlobalStore"

type ProgressiveOnboardingFindSavedArtworkProps = {
  tab: BottomTabType
}

export const ProgressiveOnboardingFindSavedArtwork: React.FC<
  ProgressiveOnboardingFindSavedArtworkProps
> = ({ children, tab }) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const { dismiss, setActivePopover } = GlobalStore.actions.progressiveOnboarding
  const profileTabProps = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.tabProps.profile
  )

  const isDisplayable =
    isReady && !isDismissed("find-saved-artwork").status && !!profileTabProps?.savedArtwork
  const { isActive } = useSetActivePopover(isDisplayable)

  if (tab !== "profile" || !isActive) {
    return <>{children}</>
  }

  const handleDismiss = () => {
    dismiss("find-saved-artwork")
  }

  return (
    <Popover
      visible={!!isDisplayable}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={() => setActivePopover(undefined)}
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
