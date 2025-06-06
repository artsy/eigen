import { fireEvent, screen } from "@testing-library/react-native"
import { ProgressiveOnboardingAlertFinish } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingAlertFinish"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("ProgressiveOnboardingAlertFinish", () => {
  const wrapper = () =>
    renderWithWrappers(
      <ProgressiveOnboardingAlertFinish>
        <Text>Test Children</Text>
      </ProgressiveOnboardingAlertFinish>
    )

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableProgressiveOnboardingAlerts: true })
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
  })

  it("renders", () => {
    wrapper()

    expect(screen.getByText("Test Children")).toBeOnTheScreen()
    expect(screen.queryByText("When you’re ready, click Create Alert.")).not.toBeOnTheScreen()
  })

  it("shows the tooltip given all the conditions are met", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [{ key: "alert-select-filters", timestamp: Date.now() }],
      },
    })
    wrapper()

    expect(screen.getByText("When you’re ready, click Create Alert.")).toBeOnTheScreen()
  })

  it("dismisses the alert when tapping on it", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [{ key: "alert-select-filters", timestamp: Date.now() }],
      },
    })
    wrapper()

    fireEvent.press(screen.getByText("When you’re ready, click Create Alert."))

    expect(__globalStoreTestUtils__?.getLastAction()).toHaveProperty("payload", "alert-finish")
    expect(screen.queryByText("When you’re ready, click Create Alert.")).not.toBeOnTheScreen()
  })

  it("does not show the tooltip if 'alert-select-filters' is not dismissed", () => {
    wrapper()
    expect(screen.queryByText("When you’re ready, click Create Alert.")).not.toBeOnTheScreen()
  })
})
