import { ToolTip } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_FINISH,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS,
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
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
    !!isDismissed(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK) &&
    !!progressiveOnboardingAlerts

  const handleDismiss = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_FINISH)
  }

  /**
   * using ToolTip instead of Popover here because we cannot display a Popover inside
   * of a modal (which is where this component is used)
   *  */
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
