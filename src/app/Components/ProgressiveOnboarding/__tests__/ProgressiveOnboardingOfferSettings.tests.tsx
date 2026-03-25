import { fireEvent, screen } from "@testing-library/react-native"
import { ProgressiveOnboardingOfferSettings } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingOfferSettings"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useEffect } from "react"
import { Text, View } from "react-native"

jest.mock("app/utils/Sentinel", () => ({
  __esModule: true,
  Sentinel: (props: any) => <MockedVisibleSentinel {...props} />,
}))

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

describe("ProgressiveOnboardingOfferSettings", () => {
  const wrapper = () =>
    renderWithWrappers(
      <ProgressiveOnboardingOfferSettings>
        <Text>I'm not real</Text>
      </ProgressiveOnboardingOfferSettings>
    )

  beforeEach(() => {
    mockUseIsFocusedMock.mockReturnValue(true)
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnablePartnerOffer: true })
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: false },
        dismissed: [{ key: "signal-interest", timestamp: expect.any(Number) }],
      },
    })
  })

  it("renders", () => {
    wrapper()

    expect(screen.getByText("I'm not real")).toBeOnTheScreen()
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })

  it("shows the popover given all the conditions are met", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworkListOfferability: true })
    wrapper()

    expect(screen.getByText("Popover")).toBeOnTheScreen()
  })

  it("dismisses the alert when tapping on it", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworkListOfferability: true })
    wrapper()

    fireEvent.press(screen.getByText("Popover"))

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(state?.progressiveOnboarding.dismissed).toStrictEqual([
      { key: "signal-interest", timestamp: expect.any(Number) },
      { key: "offer-settings", timestamp: expect.any(Number) },
    ])
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

const MockedVisibleSentinel: React.FC<any> = ({ children, onChange }) => {
  useEffect(() => onChange(true), [])

  return <View>{children}</View>
}
