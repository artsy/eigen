import { ContextModule, OwnerType } from "@artsy/cohesion"
import { useIsFocused } from "@react-navigation/native"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_SIGNAL_INTEREST } from "app/store/ProgressiveOnboardingModel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingSignalInterest: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isFocused = useIsFocused()
  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")
  const progressiveOnboardingAlerts = useFeatureFlag("AREnableProgressiveOnboardingAlerts")

  return (
    <OnboardingPopover
      id={PROGRESSIVE_ONBOARDING_SIGNAL_INTEREST}
      when={!!isPartnerOfferEnabled && !!progressiveOnboardingAlerts && !!isReady && isFocused}
      delay={200}
      placement="top"
      title={`Learn more about saves and how to\nmanage your preferences.`}
      contextScreenOwnerType={OwnerType.saves}
      contextModule={ContextModule.saves}
    >
      {children}
    </OnboardingPopover>
  )
}
