import {
  PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT,
  PROGRESSIVE_ONBOARDING_SAVE_FIND,
  useProgressiveOnboarding,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingContext"
import {
  ProgressiveOnboardingHighlight,
  ProgressiveOnboardingHighlightPosition,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingHighlight"
import { FC } from "react"

interface ProgressiveOnboardingSaveHighlightProps {
  position: ProgressiveOnboardingHighlightPosition
}

export const ProgressiveOnboardingSaveHighlight: FC<ProgressiveOnboardingSaveHighlightProps> = ({
  children,
  position,
}) => {
  const { isDismissed, dismiss, isEnabledFor } = useProgressiveOnboarding()

  const isDisplayable =
    // If the feature is enabled
    isEnabledFor("saves") &&
    // And you haven't already dismissed this
    !isDismissed(PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT) &&
    // And you've previously dismissed the previous onboarding tip
    isDismissed(PROGRESSIVE_ONBOARDING_SAVE_FIND)

  if (!isDisplayable) {
    return <>{children}</>
  }

  return (
    <ProgressiveOnboardingHighlight
      handlePress={() => {
        dismiss(PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT)
      }}
      position={position}
      name={PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT}
    >
      {children}
    </ProgressiveOnboardingHighlight>
  )
}
