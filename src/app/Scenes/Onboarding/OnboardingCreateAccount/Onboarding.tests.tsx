import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { NetworkAwareProvider } from "app/utils/NetworkAwareProvider"
import { Onboarding, OnboardingWelcomeScreens } from "../Onboarding"
import { OnboardingV2 } from "../OnboardingV2/OnboardingV2"

jest.mock("../OnboardingV2/OnboardingV2.tsx", () => ({
  OnboardingV2: () => "OnboardingV2",
}))

describe("Onboarding", () => {
  it("renders the welcome screens when the onboarding state is none or complete", () => {
    const tree1 = renderWithWrappersLEGACY(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "none" } })
    expect(tree1.root.findAllByType(OnboardingV2).length).toEqual(0)
    expect(tree1.root.findAllByType(OnboardingWelcomeScreens).length).toEqual(1)

    const tree2 = renderWithWrappersLEGACY(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "complete" } })
    expect(tree2.root.findAllByType(OnboardingV2).length).toEqual(0)
    expect(tree2.root.findAllByType(OnboardingWelcomeScreens).length).toEqual(1)
  })

  it("renders the personalization flow when the onboarding state is incomplete", () => {
    const tree = renderWithWrappersLEGACY(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "incomplete" } })
    expect(tree.root.findAllByType(OnboardingV2).length).toEqual(1)
    expect(tree.root.findAllByType(OnboardingWelcomeScreens).length).toEqual(0)
  })

  it("renders NetworkAwareProvider when ARShowNetworkUnavailableModal is set to true", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARShowNetworkUnavailableModal: true })
    const tree = renderWithWrappersLEGACY(<Onboarding />)
    expect(tree.root.findAllByType(NetworkAwareProvider).length).toEqual(1)
  })

  it("does not render NetworkAwareProvider when ARShowNetworkUnavailableModal is set to false", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARShowNetworkUnavailableModal: false })
    const tree = renderWithWrappersLEGACY(<Onboarding />)
    expect(tree.root.findAllByType(NetworkAwareProvider).length).toEqual(0)
  })
})
