import { Text } from "@artsy/palette-mobile"
import {
  PROGRESSIVE_ONBOARDING_SAVE_FIND,
  PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT,
  useProgressiveOnboarding,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingContext"
import {
  ProgressiveOnboardingCounts,
  WithProgressiveOnboardingCountsProps,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingCounts"
import { ProgressiveOnboardingPopover } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPopover"
import { FC } from "react"

type ProgressiveOnboardingSaveFindProps = WithProgressiveOnboardingCountsProps

const ProgressiveOnboardingSaveFind: FC<ProgressiveOnboardingSaveFindProps> = ({
  children,
  counts,
}) => {
  const { dismiss, isDismissed, isEnabledFor } = useProgressiveOnboarding()

  const isDisplayable =
    isEnabledFor("saves") &&
    counts.savedArtworks === 1 &&
    !isDismissed(PROGRESSIVE_ONBOARDING_SAVE_FIND)

  const handleClose = () => {
    dismiss(PROGRESSIVE_ONBOARDING_SAVE_FIND)
  }

  const handleDismiss = () => {
    handleClose()
    dismiss(PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT)
  }

  if (!isDisplayable) {
    return <>{children}</>
  }

  return (
    <ProgressiveOnboardingPopover
      name={PROGRESSIVE_ONBOARDING_SAVE_FIND}
      placement="bottom-end"
      onClose={handleClose}
      onDismiss={handleDismiss}
      ignoreClickOutside={false}
      popover={<Text variant="xs">Find and edit all your Saves here.</Text>}
    >
      {children}
    </ProgressiveOnboardingPopover>
  )
}

export const ProgressiveOnboardingSaveFindQueryRenderer: FC = ({ children }) => {
  return (
    <ProgressiveOnboardingCounts Component={ProgressiveOnboardingSaveFind}>
      {children}
    </ProgressiveOnboardingCounts>
  )
}
