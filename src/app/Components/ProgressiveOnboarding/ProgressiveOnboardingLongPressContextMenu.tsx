import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingLongPressContextMenu: React.FC = ({ children }) => {
  const enableLongPressContextMenuOnboarding = useFeatureFlag(
    "AREnableLongPressContextMenuOnboarding"
  )
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()

  const isDisplayable =
    isReady && !isDismissed("long-press-artwork-context-menu").status && isFocused
  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("long-press-artwork-context-menu")
  }

  return (
    <Popover
      visible={!!enableLongPressContextMenuOnboarding && !!isDisplayable && isActive}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={clearActivePopover}
      placement="top"
      title={
        <Text variant="xs" color="white100" fontWeight={500}>
          Quick tip:
        </Text>
      }
      content={
        <Text variant="xs" color="white100">
          Reveal more options and actions on an artwork card by pressing and holding an artwork.
        </Text>
      }
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}
