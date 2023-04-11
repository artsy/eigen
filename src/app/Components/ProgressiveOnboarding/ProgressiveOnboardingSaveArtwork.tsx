import { Text } from "@artsy/palette-mobile"
import {
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
  useProgressiveOnboarding,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingContext"
import {
  ProgressiveOnboardingCountsQueryRenderer,
  WithProgressiveOnboardingCountsProps,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingCounts"
import { ProgressiveOnboardingPopover } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPopover"
import { FC, useCallback, useEffect } from "react"

type ProgressiveOnboardingSaveArtworkProps = WithProgressiveOnboardingCountsProps

export const ProgressiveOnboardingSaveArtwork: FC<ProgressiveOnboardingSaveArtworkProps> = ({
  counts,
  children,
}) => {
  const { dismiss, isDismissed, isEnabledFor } = useProgressiveOnboarding()

  const isDisplayble =
    isEnabledFor("saves") &&
    !isDismissed(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK) &&
    counts.savedArtworks === 0

  const handleClose = useCallback(() => {
    dismiss(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
  }, [dismiss])

  useEffect(() => {
    // Dismiss the save artwork onboarding once you save an artwork.
    if (counts.savedArtworks > 0 && !isDismissed(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)) {
      dismiss(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
    }
  }, [counts.savedArtworks, dismiss, isDismissed])

  if (!isDisplayble) {
    return <>{children}</>
  }

  return (
    <ProgressiveOnboardingPopover
      name={PROGRESSIVE_ONBOARDING_SAVE_ARTWORK}
      placement="bottom"
      onClose={handleClose}
      popover={
        <Text variant="xs">
          <strong>Like what you see?</strong>
          <br />
          Hit the heart to save an artwork.
        </Text>
      }
    >
      {children}
    </ProgressiveOnboardingPopover>
  )
}

export const ProgressiveOnboardingSaveArtworkQueryRenderer: FC = ({ children }) => {
  return (
    <ProgressiveOnboardingCountsQueryRenderer Component={ProgressiveOnboardingSaveArtwork}>
      {children}
    </ProgressiveOnboardingCountsQueryRenderer>
  )
}
