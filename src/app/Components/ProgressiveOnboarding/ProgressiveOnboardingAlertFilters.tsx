import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS,
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
} from "app/store/ProgressiveOnboardingModel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingAlertFilters: React.FC = ({ children }) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()
  const progressiveOnboardingAlerts = useFeatureFlag("AREnableProgressiveOnboardingAlerts")

  const isDisplayable =
    isReady &&
    !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS).status &&
    !!isDismissed(PROGRESSIVE_ONBOARDING_ALERT_CREATE).status &&
    !!isDismissed(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK) &&
    !!progressiveOnboardingAlerts &&
    isFocused
  const { clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS)
  }

  return (
    <Popover
      visible={!!isDisplayable}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={clearActivePopover}
      placement="bottom"
      title={
        <Text variant="xs" color="white100">
          First, select the relevant filters.
        </Text>
      }
    >
      <Flex pointerEvents="box-none">{children}</Flex>
    </Popover>
  )
}
