import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { OnboardingOrderedSetScreen } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/OnboardingOrderedSet"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking")

describe("OnboardingOrderedSet", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("renders artists correctly", async () => {
    renderWithHookWrappersTL(<OnboardingOrderedSetScreen id="onboarding:suggested-artists" />, env)

    resolveMostRecentRelayOperation(env)

    await waitForElementToBeRemoved(() =>
      screen.getByTestId("OnboardingPersonalizationListPlaceholder")
    )

    expect(screen.getByText("name-1")).toBeTruthy()
    expect(screen.getByText("nationality-1, birthday-1-deathday-1")).toBeTruthy()
  })
})
