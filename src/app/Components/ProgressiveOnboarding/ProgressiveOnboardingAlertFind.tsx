import { Text } from "@artsy/palette-mobile"
import { Z } from "Apps/Components/constants"
import {
  PROGRESSIVE_ONBOARDING_ALERT_FIND,
  useProgressiveOnboarding,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingContext"
import {
  ProgressiveOnboardingCountsQueryRenderer,
  WithProgressiveOnboardingCountsProps,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingCounts"
import { ProgressiveOnboardingPopover } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPopover"
import { FC } from "react"

type ProgressiveOnboardingAlertFindProps = WithProgressiveOnboardingCountsProps

const ProgressiveOnboardingAlertFind: FC<ProgressiveOnboardingAlertFindProps> = ({
  children,
  counts,
}) => {
  const { dismiss, isDismissed, isEnabledFor } = useProgressiveOnboarding()

  const isDisplayable =
    isEnabledFor("alerts") &&
    counts.savedSearches === 1 &&
    !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FIND)

  const handleClose = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_FIND)
  }

  const handleDismiss = () => {
    handleClose()
  }

  if (!isDisplayable) {
    return <>{children}</>
  }

  return (
    <ProgressiveOnboardingPopover
      name={PROGRESSIVE_ONBOARDING_ALERT_FIND}
      placement="bottom-end"
      onClose={handleClose}
      onDismiss={handleDismiss}
      ignoreClickOutside={false}
      zIndex={Z.dropdown}
      popover={<Text variant="xs">Find and edit all your Alerts here.</Text>}
    >
      {children}
    </ProgressiveOnboardingPopover>
  )
}

export const ProgressiveOnboardingAlertFindQueryRenderer: FC = ({ children }) => {
  return (
    <ProgressiveOnboardingCountsQueryRenderer Component={ProgressiveOnboardingAlertFind}>
      {children}
    </ProgressiveOnboardingCountsQueryRenderer>
  )
}
