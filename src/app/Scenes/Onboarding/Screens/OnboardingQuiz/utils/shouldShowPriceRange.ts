import {
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_HUNTING_FOR_ART_WITHIN_BUDGET,
} from "app/Scenes/Onboarding/Screens/OnboardingQuiz/config"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"

/**
 * Determines whether the price range screen should be shown based on an answers array
 * @param answers - Array of selected answers from question
 * @returns boolean indicating whether to show the price range screen
 */
export const shouldShowPriceRange = (answers?: string[] | null): boolean => {
  if (
    !answers ||
    answers.length === 0 ||
    !unsafe_getFeatureFlag("ARShowOnboardingPriceRangeScreen")
  ) {
    return false
  }

  return (
    answers.includes(OPTION_FINDING_GREAT_INVESTMENTS) ||
    answers.includes(OPTION_HUNTING_FOR_ART_WITHIN_BUDGET)
  )
}
