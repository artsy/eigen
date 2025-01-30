import { screen } from "@testing-library/react-native"
import { Onboarding, OnboardingWelcomeScreens } from "app/Scenes/Onboarding/Onboarding"
import { OnboardingQuiz } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingQuiz"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { NetworkAwareProvider } from "app/utils/NetworkAwareProvider"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("../OnboardingQuiz/OnboardingQuiz.tsx", () => ({
  OnboardingQuiz: () => "OnboardingQuiz",
}))

describe("Onboarding", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableSignupLoginFusion: false,
    })
  })

  it("renders the welcome screens when the onboarding state is none or complete", () => {
    renderWithWrappers(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "none" } })

    expect(screen.UNSAFE_queryByType(OnboardingQuiz)).toBeFalsy()
    expect(screen.UNSAFE_getByType(OnboardingWelcomeScreens)).toBeTruthy()

    renderWithWrappers(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "complete" } })

    expect(screen.UNSAFE_queryByType(OnboardingQuiz)).toBeFalsy()
    expect(screen.UNSAFE_getByType(OnboardingWelcomeScreens)).toBeTruthy()
  })

  it("renders the personalization flow when the onboarding state is incomplete", () => {
    renderWithWrappers(<Onboarding />)
    __globalStoreTestUtils__?.injectState({ auth: { onboardingState: "incomplete" } })
    expect(screen.UNSAFE_getByType(OnboardingQuiz)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(OnboardingWelcomeScreens)).toBeFalsy()
  })

  it("renders NetworkAwareProvider", () => {
    renderWithWrappers(<Onboarding />)

    expect(screen.UNSAFE_getByType(NetworkAwareProvider)).toBeTruthy()
  })
})
