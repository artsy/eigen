import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { NetworkAwareProvider } from "app/utils/NetworkAwareProvider"
import React from "react"
import { Onboarding, OnboardingWelcomeScreens } from "../Onboarding"
import { OnboardingPersonalization } from "../OnboardingPersonalization/OnboardingPersonalization"

jest.mock("../OnboardingPersonalization/OnboardingPersonalization.tsx", () => ({
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

  it("renders NetworkAwareProvider when ARShowNetworkUnavailableModal is set to true", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARShowNetworkUnavailableModal: true })
    const tree = renderWithWrappers(<Onboarding />)
    expect(tree.root.findAllByType(NetworkAwareProvider).length).toEqual(1)
  })

  it("does not render NetworkAwareProvider when ARShowNetworkUnavailableModal is set to false", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARShowNetworkUnavailableModal: false })
    const tree = renderWithWrappers(<Onboarding />)
    expect(tree.root.findAllByType(NetworkAwareProvider).length).toEqual(0)
  })
})
