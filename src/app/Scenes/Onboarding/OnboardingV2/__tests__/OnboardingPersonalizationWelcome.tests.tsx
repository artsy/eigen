import { screen } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { OnboardingPersonalizationWelcome } from "../OnboardingPersonalizationWelcome"

jest.unmock("react-relay")

jest.mock("app/Scenes/Onboarding/OnboardingV2/Hooks/useOnboardingTracking")

describe("OnboardingPersonalizationWelcome", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("should display the welcome message", async () => {
    renderWithHookWrappersTL(<OnboardingPersonalizationWelcome />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        name: "Stewie",
      }),
    })

    await flushPromiseQueue()

    expect(screen.queryByText("Welcome to Artsy, Stewie")).toBeTruthy()
  })
})
