import {
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_HUNTING_FOR_ART_WITHIN_BUDGET,
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_KEEP_TRACK_OF_ART,
  OPTION_COLLECTING_ART_THAT_MOVES_ME,
} from "app/Scenes/Onboarding/Screens/OnboardingQuiz/config"
import { shouldShowPriceRange } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/utils/shouldShowPriceRange"

describe("shouldShowPriceRange", () => {
  it("returns false for empty array", () => {
    expect(shouldShowPriceRange([])).toBe(false)
  })

  it("returns false for null", () => {
    expect(shouldShowPriceRange(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(shouldShowPriceRange(undefined)).toBe(false)
  })

  it("returns true when OPTION_FINDING_GREAT_INVESTMENTS is selected", () => {
    expect(shouldShowPriceRange([OPTION_FINDING_GREAT_INVESTMENTS])).toBe(true)
  })

  it("returns true when OPTION_HUNTING_FOR_ART_WITHIN_BUDGET is selected", () => {
    expect(shouldShowPriceRange([OPTION_HUNTING_FOR_ART_WITHIN_BUDGET])).toBe(true)
  })

  it("returns true when both relevant options are selected", () => {
    expect(
      shouldShowPriceRange([OPTION_FINDING_GREAT_INVESTMENTS, OPTION_HUNTING_FOR_ART_WITHIN_BUDGET])
    ).toBe(true)
  })

  it("returns false when only non-relevant options are selected", () => {
    expect(
      shouldShowPriceRange([
        OPTION_DEVELOPING_MY_ART_TASTES,
        OPTION_KEEP_TRACK_OF_ART,
        OPTION_COLLECTING_ART_THAT_MOVES_ME,
      ])
    ).toBe(false)
  })

  it("returns true when relevant options are mixed with non-relevant ones", () => {
    expect(
      shouldShowPriceRange([
        OPTION_DEVELOPING_MY_ART_TASTES,
        OPTION_FINDING_GREAT_INVESTMENTS,
        OPTION_KEEP_TRACK_OF_ART,
      ])
    ).toBe(true)

    expect(
      shouldShowPriceRange([
        OPTION_COLLECTING_ART_THAT_MOVES_ME,
        OPTION_HUNTING_FOR_ART_WITHIN_BUDGET,
      ])
    ).toBe(true)
  })

  it("returns false for single non-relevant option", () => {
    expect(shouldShowPriceRange([OPTION_DEVELOPING_MY_ART_TASTES])).toBe(false)
    expect(shouldShowPriceRange([OPTION_KEEP_TRACK_OF_ART])).toBe(false)
    expect(shouldShowPriceRange([OPTION_COLLECTING_ART_THAT_MOVES_ME])).toBe(false)
  })

  it("returns false for unknown options", () => {
    expect(shouldShowPriceRange(["Unknown Option"])).toBe(false)
    expect(shouldShowPriceRange(["Another Unknown", "Yet Another"])).toBe(false)
  })
})
