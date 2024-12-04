import { fireEvent, screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { ProgressiveOnboardingAlertFilters } from "./ProgressiveOnboardingAlertFilters"

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Popover: (props: any) => <MockedPopover {...props} />,
}))

const mockUseIsFocusedMock = jest.fn()

const mockAddListener = jest.fn((event, callback) => {
  if (event === "focus" || event === "blur") {
    callback()
  }
  return jest.fn() // return a function to mimic the unsubscribe function
})

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    addListener: mockAddListener,
    navigate: jest.fn(),
  }),
  useIsFocused: () => mockUseIsFocusedMock(),
}))

describe("ProgressiveOnboardingAlertFilters", () => {
  const wrapper = () =>
    renderWithWrappers(
      <ProgressiveOnboardingAlertFilters>
        <Text>Test Children</Text>
      </ProgressiveOnboardingAlertFilters>
    )

  beforeEach(() => {
    mockUseIsFocusedMock.mockReturnValue(true)
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableProgressiveOnboardingAlerts: true })
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
  })

  it("renders", () => {
    wrapper()

    expect(screen.getByText("Test Children")).toBeOnTheScreen()
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })

  it("shows the popover given all the conditions are met", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [{ key: "alert-create", timestamp: Date.now() }],
      },
    })
    wrapper()

    expect(screen.getByText("Popover")).toBeOnTheScreen()
  })

  it("dismisses the alert when tapping on it", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [{ key: "alert-create", timestamp: Date.now() }],
      },
    })
    wrapper()

    fireEvent.press(screen.getByText("Popover"))

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(state?.progressiveOnboarding.dismissed).toStrictEqual([
      {
        key: "alert-create",
        timestamp: expect.any(Number),
      },
      {
        key: "alert-select-filters",
        timestamp: expect.any(Number),
      },
    ])
  })

  it("does not show the popover given another popover is active", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true, activePopover: "save-artwork" },
        dismissed: [{ key: "alert-create", timestamp: Date.now() }],
      },
    })

    wrapper()
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })

  it("does not show the popover given isFocused false", () => {
    mockUseIsFocusedMock.mockReturnValue(false)

    wrapper()
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })
})

const MockedPopover: React.FC<any> = ({ children, onDismiss, visible }) => {
  if (!visible) {
    return <>{children}</>
  }

  return (
    <>
      <Text onPress={onDismiss}>Popover</Text>
      <>{children}</>
    </>
  )
}
