import { Text } from "@artsy/palette-mobile"
import {
  PROGRESSIVE_ONBOARDING_FOLLOW_FIND,
  PROGRESSIVE_ONBOARDING_FOLLOW_HIGHLIGHT,
  useProgressiveOnboarding,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingContext"
import {
  ProgressiveOnboardingCounts,
  WithProgressiveOnboardingCountsProps,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingCounts"
import { ProgressiveOnboardingPopover } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPopover"
import { FC } from "react"

type ProgressiveOnboardingFollowFindProps = WithProgressiveOnboardingCountsProps

const ProgressiveOnboardingFollowFind: FC<ProgressiveOnboardingFollowFindProps> = ({
  children,
  counts,
}) => {
  const { dismiss, isDismissed, isEnabledFor } = useProgressiveOnboarding()

  const isDisplayable =
    isEnabledFor("follows") &&
    counts.followedArtists === 1 &&
    !isDismissed(PROGRESSIVE_ONBOARDING_FOLLOW_FIND)

  const handleClose = () => {
    dismiss(PROGRESSIVE_ONBOARDING_FOLLOW_FIND)
  }

  const handleDismiss = () => {
    handleClose()
    dismiss(PROGRESSIVE_ONBOARDING_FOLLOW_HIGHLIGHT)
  }

  if (!isDisplayable) {
    return <>{children}</>
  }

  return (
    <ProgressiveOnboardingPopover
      name={PROGRESSIVE_ONBOARDING_FOLLOW_FIND}
      placement="bottom-end"
      onClose={handleClose}
      onDismiss={handleDismiss}
      ignoreClickOutside={false}
      popover={<Text variant="xs">Find and edit all your Follows here.</Text>}
    >
      {children}
    </ProgressiveOnboardingPopover>
  )
}

export const ProgressiveOnboardingFollowFindQueryRenderer: FC = ({ children }) => {
  return (
    <ProgressiveOnboardingCounts Component={ProgressiveOnboardingFollowFind}>
      {children}
    </ProgressiveOnboardingCounts>
  )
}
