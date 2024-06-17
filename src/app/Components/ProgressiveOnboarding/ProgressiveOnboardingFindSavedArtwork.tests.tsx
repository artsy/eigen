import { fireEvent, screen, render } from "@testing-library/react-native"
import { GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useEffect } from "react"
import { Text, View } from "react-native"
import { ProgressiveOnboardingFindSavedArtwork } from "./ProgressiveOnboardingFindSavedArtwork"

jest.mock("app/utils/ElementInView", () => ({
  ElementInView: (props: any) => <MockedVisibleSentinel {...props} />,
}))

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Popover: (props: any) => <MockedPopover {...props} />,
}))

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
  useIsFocused: () => jest.fn(),
}))

describe("ProgressiveOnboardingFindSavedArtwork", () => {
  const wrapper = (tab: "profile" | "home") =>
    render(
      <GlobalStoreProvider>
        <ProgressiveOnboardingFindSavedArtwork tab={tab}>
          <Text>Test Children</Text>
        </ProgressiveOnboardingFindSavedArtwork>
      </GlobalStoreProvider>
    )

  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
  })

  it("renders", () => {
    wrapper("profile")

    expect(screen.getByText("Test Children")).toBeOnTheScreen()
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })

  it("dismisses find-saved-artwork when dismissing the popover", () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { tabProps: { profile: { savedArtwork: true } } } },
    })

    wrapper("profile")

    fireEvent.press(screen.getByText("Popover"))
    expect(__globalStoreTestUtils__?.getLastAction().type).toContain("dismiss")
  })

  it("does not show the popover if 'find-save-artwork' is already dismissed", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [{ key: "find-saved-artwork", timestamp: Date.now() }],
      },
    })

    wrapper("profile")
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })

  it("does not show the popover given a tab different than 'profile'", () => {
    wrapper("home")

    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })

  it("does not show the popover given isReady false", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: false } },
    })
    wrapper("home")

    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })
})

const MockedVisibleSentinel: React.FC<any> = ({ children, onVisible }) => {
  useEffect(() => onVisible(), [])

  return <View>{children}</View>
}

const MockedPopover: React.FC<any> = ({ children, onDismiss, visible }) => {
  if (!visible) {
    return <>{children}</>
  }

  return (
    <>
      <Text onPress={onDismiss}>Popover</Text>
      {children}
    </>
  )
}
