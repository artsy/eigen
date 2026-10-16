import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Button, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_CHAIN,
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
} from "app/store/ProgressiveOnboardingModel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingSaveAlert: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()
  const progressiveOnboardingAlerts = useFeatureFlag("AREnableProgressiveOnboardingAlerts")

  const handleDismiss = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_CREATE)
  }

  const handleDismissAlertsOnboarding = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_CHAIN)
  }

  return (
    <OnboardingPopover
      id={PROGRESSIVE_ONBOARDING_ALERT_CREATE}
      when={
        !!isReady &&
        !!isDismissed("save-artwork").status &&
        !!progressiveOnboardingAlerts &&
        isFocused
      }
      delay={200}
      variant="light"
      placement="right"
      onDismiss={handleDismiss}
      title={
        <Text variant="xs" fontWeight="bold">
          Hunting for a particular artwork?
        </Text>
      }
      content={
        <Flex>
          <Join separator={<Spacer y={1} />}>
            <Text variant="xs">
              Set the filters for the artwork you’re looking for, then create your alert. We’ll let
              you know when there’s a matching work.
            </Text>

            <Flex flexDirection="row" justifyContent="flex-end">
              <Button variant="outline" onPress={handleDismiss} size="small">
                Learn more
              </Button>
              <Button
                variant="fillDark"
                onPress={handleDismissAlertsOnboarding}
                size="small"
                ml={1}
              >
                Got it
              </Button>
            </Flex>
          </Join>
        </Flex>
      }
      contextScreenOwnerType={OwnerType.artist}
      contextModule={ContextModule.artistArtworksFilterHeader}
    >
      {children}
    </OnboardingPopover>
  )
}
