import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ToolTip } from "@artsy/palette-mobile"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect } from "react"

export const ProgressiveOnboardingAlertFinish: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const progressiveOnboardingAlerts = useFeatureFlag("AREnableProgressiveOnboardingAlerts")
  const { trackEvent } = useProgressiveOnboardingTracking({
    name: "alert-finish",
    contextScreenOwnerType: OwnerType.artist,
    contextModule: ContextModule.filterScreen,
  })

  const isDisplayable =
    isReady &&
    !isDismissed("alert-finish").status &&
    !!isDismissed("alert-select-filters").status &&
    !!progressiveOnboardingAlerts

  const handleDismiss = () => {
    dismiss("alert-finish")
  }

  useEffect(() => {
    if (!!isDisplayable) {
      trackEvent()
    }
  }, [isDisplayable])

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
