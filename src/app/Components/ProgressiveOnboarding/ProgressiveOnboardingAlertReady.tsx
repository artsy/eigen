import { Text } from "@artsy/palette-mobile"
import {
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
  PROGRESSIVE_ONBOARDING_ALERT_READY,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER,
  useProgressiveOnboarding,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingContext"
import { ProgressiveOnboardingPopover } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPopover"
import { FC, ReactNode } from "react"

interface ProgressiveOnboardingAlertReadyProps {
  children: (actions: { onSkip(): void }) => ReactNode
}

export const ProgressiveOnboardingAlertReady: FC<ProgressiveOnboardingAlertReadyProps> = ({
  children,
}) => {
  const { dismiss, isDismissed, isEnabledFor } = useProgressiveOnboarding()

  const isDisplayable =
    isEnabledFor("alerts") &&
    isDismissed(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER) &&
    isDismissed(PROGRESSIVE_ONBOARDING_ALERT_CREATE) &&
    !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_READY)

  const handleClose = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_CREATE)
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER)
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_READY)
  }

  if (!isDisplayable) {
    return <>{children({ onSkip: () => {} })}</>
  }

  return (
    <ProgressiveOnboardingPopover
      name={PROGRESSIVE_ONBOARDING_ALERT_READY}
      placement="bottom"
      onClose={handleClose}
      popover={<Text variant="xs">When you’re ready, click Create Alert.</Text>}
    >
      {children({ onSkip: handleClose })}
    </ProgressiveOnboardingPopover>
  )
}
