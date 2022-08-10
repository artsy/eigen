import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { OnboardingOrderedSetScreen } from "../OnboardingOrderedSet"

jest.unmock("react-relay")

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
