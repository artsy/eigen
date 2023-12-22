import { ToolTip } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
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
    !isDismissed("alert-finish").status &&
    !!isDismissed("alert-select-filters").status &&
    !!progressiveOnboardingAlerts

  const handleDismiss = () => {
    dismiss("alert-finish")
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
