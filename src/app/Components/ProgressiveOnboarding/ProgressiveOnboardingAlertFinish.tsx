import { ToolTip } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_FINISH,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS,
} from "app/store/ProgressiveOnboardingModel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingAlertFinish: React.FC = ({ children }) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const progressiveOnboardingAlerts = useFeatureFlag("AREnableProgressiveOnboardingAlerts")

  const isDisplayable =
    isReady &&
    !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FINISH).status &&
    !!isDismissed(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS).status &&
    !!progressiveOnboardingAlerts

  const handleDismiss = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_FINISH)
  }

  return (
    <ToolTip
      enabled={!!isDisplayable}
      initialToolTipText="When you’re ready, click Create Alert."
      position="TOP"
      onPress={handleDismiss}
    >
      <>{children}</>
    </ToolTip>
  )
}
