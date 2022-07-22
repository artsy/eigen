import { screen } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { OnboardingPersonalizationWelcome } from "./OnboardingPersonalizationWelcome"

describe("OnboardingPersonalizationWelcome", () => {
  it("should display the welcome message", async () => {
    renderWithRelayWrappers(<OnboardingPersonalizationWelcome />)

    resolveMostRecentRelayOperation({
      Me: () => ({
        name: "Stewie",
      }),
    })

    await flushPromiseQueue()

    expect(screen.queryByText("Welcome to Artsy, Stewie")).toBeTruthy()
  })
})
