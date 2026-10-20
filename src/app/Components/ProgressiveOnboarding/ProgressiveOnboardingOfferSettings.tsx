import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_OFFER_SETTINGS } from "app/store/ProgressiveOnboardingModel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingOfferSettings: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isFocused = useIsFocused()
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")

  return (
    <OnboardingPopover
      id={PROGRESSIVE_ONBOARDING_OFFER_SETTINGS}
      when={
        !!isArtworkListOfferabilityEnabled &&
        !!isReady &&
        !!isDismissed("signal-interest").status &&
        isFocused
      }
      delay={500}
      placement="top"
      title={
        <Text variant="xs" color="mono0">
          Edit list settings to indicate to{"\n"}galleries which artworks you want{"\n"}to receive
          offers on.
        </Text>
      }
      contextScreenOwnerType={OwnerType.saves}
      contextModule={ContextModule.saves}
    >
      {children}
    </OnboardingPopover>
  )
}
