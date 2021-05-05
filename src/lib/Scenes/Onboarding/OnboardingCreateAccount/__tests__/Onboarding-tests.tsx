import React from "react"
import { __globalStoreTestUtils__ } from "../../../../store/GlobalStore"
import { renderWithWrappers } from "../../../../tests/renderWithWrappers"
import { Onboarding, OnboardingWelcomeScreens } from "../../Onboarding"
import { OnboardingPersonalization } from "../../OnboardingPersonalization/OnboardingPersonalization"

jest.mock("../../OnboardingPersonalization/OnboardingPersonalization.tsx", () => ({
  OnboardingPersonalization: () => "OnboardingPersonalization",
}))

describe("Onboarding", () => {
  it("renders the welcome screens when the onboarding state is none or complete", () => {
    const tree1 = renderWithWrappers(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "none" } })
    expect(tree1.root.findAllByType(OnboardingPersonalization).length).toEqual(0)
    expect(tree1.root.findAllByType(OnboardingWelcomeScreens).length).toEqual(1)

    const tree2 = renderWithWrappers(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "complete" } })
    expect(tree2.root.findAllByType(OnboardingPersonalization).length).toEqual(0)
    expect(tree2.root.findAllByType(OnboardingWelcomeScreens).length).toEqual(1)
  })

  it("renders the personalization flow when the onboarding state is incomplete", () => {
    const tree = renderWithWrappers(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "incomplete" } })
    expect(tree.root.findAllByType(OnboardingPersonalization).length).toEqual(1)
    expect(tree.root.findAllByType(OnboardingWelcomeScreens).length).toEqual(0)
  })
})
