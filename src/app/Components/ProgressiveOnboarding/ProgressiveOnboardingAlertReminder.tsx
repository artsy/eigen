import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Text } from "@artsy/palette-mobile"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { useDismissAlertReminder } from "app/Components/ProgressiveOnboarding/useDismissAlertReminder"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2,
} from "app/store/ProgressiveOnboardingModel"

interface ProgressiveOnboardingAlertReminderProps {
  visible: boolean
}
export const ProgressiveOnboardingAlertReminder: React.FC<
  React.PropsWithChildren<ProgressiveOnboardingAlertReminderProps>
> = ({ children, visible }) => {
  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  // The reminder is shown twice; which key is "current" decides what we track.
  const currentKey = !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status
    ? PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1
    : PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2

  const { isDisplayable, dismissNextCreateAlertReminder } = useDismissAlertReminder()

  return (
    <OnboardingPopover
      id={currentKey}
      when={!!isDisplayable && visible}
      delay={200}
      placement="bottom"
      onDismiss={dismissNextCreateAlertReminder}
      title={
        <Text variant="xs" color="mono0" fontWeight="bold">
          Searching for a particular artwork?
        </Text>
      }
      content={
        <Text variant="xs" color="mono0">
          Create an alert and we’ll let you know when there’s a match.
        </Text>
      }
      contextScreenOwnerType={OwnerType.artist}
      contextModule={ContextModule.artistArtworksFilterHeader}
    >
      {children}
    </OnboardingPopover>
  )
}
