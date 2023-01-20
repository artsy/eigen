import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { NetworkAwareProvider } from "app/utils/NetworkAwareProvider"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Onboarding, OnboardingWelcomeScreens } from "../Onboarding"
import { OnboardingQuiz } from "../OnboardingQuiz/OnboardingQuiz"

jest.mock("../OnboardingQuiz/OnboardingQuiz.tsx", () => ({
  OnboardingQuiz: () => "OnboardingQuiz",
}))

describe("Onboarding", () => {
  it("renders the welcome screens when the onboarding state is none or complete", () => {
    const tree1 = renderWithWrappersLEGACY(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "none" } })
    expect(tree1.root.findAllByType(OnboardingQuiz).length).toEqual(0)
    expect(tree1.root.findAllByType(OnboardingWelcomeScreens).length).toEqual(1)

    const tree2 = renderWithWrappersLEGACY(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "complete" } })
    expect(tree2.root.findAllByType(OnboardingQuiz).length).toEqual(0)
    expect(tree2.root.findAllByType(OnboardingWelcomeScreens).length).toEqual(1)
  })

  it("renders the personalization flow when the onboarding state is incomplete", () => {
    const tree = renderWithWrappersLEGACY(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "incomplete" } })
    expect(tree.root.findAllByType(OnboardingQuiz).length).toEqual(1)
    expect(tree.root.findAllByType(OnboardingWelcomeScreens).length).toEqual(0)
  })

  it("renders NetworkAwareProvider", () => {
    const tree = renderWithWrappersLEGACY(<Onboarding />)
    expect(tree.root.findAllByType(NetworkAwareProvider).length).toEqual(1)
  })
})
