import { fireEvent, screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { ProgressiveOnboardingSaveAlert } from "./ProgressiveOnboardingSaveAlert"

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
  useNavigation: () => ({
    addListener: mockAddListener,
    navigate: jest.fn(),
  }),
  useIsFocused: () => mockUseIsFocusedMock(),
}))

describe("ProgressiveOnboardingSaveAlert", () => {
  const wrapper = () =>
    renderWithWrappers(
      <ProgressiveOnboardingSaveAlert>
        <Text>Test Children</Text>
      </ProgressiveOnboardingSaveAlert>
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
        dismissed: [{ key: "save-highlight", timestamp: Date.now() }],
      },
    })
    wrapper()

    expect(screen.getByText("Popover")).toBeOnTheScreen()
  })

  it("dismisses the alert chain when tapping 'Got it'", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [{ key: "save-highlight", timestamp: Date.now() }],
      },
    })
    wrapper()

    await screen.findByText("Got it")
    fireEvent.press(screen.getByText("Got it"))

    expect(__globalStoreTestUtils__?.getLastAction()).toHaveProperty("payload", [
      "alert-create",
      "alert-select-filters",
      "alert-finish",
    ])
  })

  it("dismisses the alert 'alert-create' when tapping 'Got it'", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [{ key: "save-highlight", timestamp: Date.now() }],
      },
    })
    wrapper()

    await screen.findByText("Learn more")
    fireEvent.press(screen.getByText("Learn more"))

    expect(__globalStoreTestUtils__?.getLastAction()).toHaveProperty("payload", "alert-create")
  })

  it("does not show the popover if 'save-highlight' is not dismissed", () => {
    wrapper()
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })

  it("does not show the popover given another popover is active", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true, activePopover: "save-artwork" },
        dismissed: [],
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

const MockedPopover: React.FC<any> = ({ children, onDismiss, visible, content }) => {
  if (!visible) {
    return <>{children}</>
  }

  return (
    <>
      <Text onPress={onDismiss}>Popover</Text>
      <>{children}</>
      <>{content}</>
    </>
  )
}
