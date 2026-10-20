import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS } from "app/store/ProgressiveOnboardingModel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingAlertFilters: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isFocused = useIsFocused()
  const progressiveOnboardingAlerts = useFeatureFlag("AREnableProgressiveOnboardingAlerts")

  return (
    <OnboardingPopover
      id={PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS}
      when={
        !!isReady &&
        !!isDismissed("alert-create").status &&
        !!progressiveOnboardingAlerts &&
        isFocused
      }
      delay={200}
      placement="bottom"
      title={
        <Text variant="xs" color="mono0">
          First, select the relevant filters.
        </Text>
      }
      contextScreenOwnerType={OwnerType.artist}
      contextModule={ContextModule.artistArtworksFilterHeader}
      // The anchor sits over the filter header and must not swallow its taps.
      pointerEvents="box-none"
    >
      {children}
    </OnboardingPopover>
  )
}
