import {
  PROGRESSIVE_ONBOARDING_FOLLOW_HIGHLIGHT,
  PROGRESSIVE_ONBOARDING_FOLLOW_FIND,
  useProgressiveOnboarding,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingContext"
import {
  ProgressiveOnboardingHighlight,
  ProgressiveOnboardingHighlightPosition,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingHighlight"
import { FC } from "react"

interface ProgressiveOnboardingFollowHighlightProps {
  position: ProgressiveOnboardingHighlightPosition
}

export const ProgressiveOnboardingFollowHighlight: FC<
  ProgressiveOnboardingFollowHighlightProps
> = ({ children, position }) => {
  const { isDismissed, dismiss, isEnabledFor } = useProgressiveOnboarding()

  const isDisplayable =
    // If the feature is enabled
    isEnabledFor("follows") &&
    // And you haven't already dismissed this
    !isDismissed(PROGRESSIVE_ONBOARDING_FOLLOW_HIGHLIGHT) &&
    // And you've previously dismissed the previous onboarding tip
    isDismissed(PROGRESSIVE_ONBOARDING_FOLLOW_FIND)

  if (!isDisplayable) {
    return <>{children}</>
  }

  return (
    <ProgressiveOnboardingHighlight
      handlePress={() => {
        dismiss(PROGRESSIVE_ONBOARDING_FOLLOW_HIGHLIGHT)
      }}
      position={position}
      name={PROGRESSIVE_ONBOARDING_FOLLOW_HIGHLIGHT}
    >
      {children}
    </ProgressiveOnboardingHighlight>
  )
}
