import { fireEvent, screen } from "@testing-library/react-native"
import { ProgressiveOnboardingSaveArtwork } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSaveArtwork"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { useEffect } from "react"
import { Text, View } from "react-native"
import { graphql } from "react-relay"

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

describe("ProgressiveOnboardingSaveArtwork", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <ProgressiveOnboardingSaveArtwork>
        <Text>Test Children</Text>
      </ProgressiveOnboardingSaveArtwork>
    ),
    query: graphql`
      query ProgressiveOnboardingSaveArtworkTestsQuery @relay_test_operation {
        me {
          counts {
            savedArtworks
          }
        }
      }
    `,
  })

  afterEach(() => {
    mockAddListener.mockClear()
  })

  it("renders", () => {
    renderWithRelay({ MeCounts: () => ({ savedArtworks: 1 }) })

    expect(screen.getByText("Test Children")).toBeOnTheScreen()
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })

  it("dismisses the save-artwork popover from store", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
      },
    })
    renderWithRelay({ MeCounts: () => ({ savedArtworks: 0 }) })

    expect(screen.getByText("Test Children")).toBeOnTheScreen()

    expect(screen.getByText("Popover")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Popover"))

    expect(__globalStoreTestUtils__?.getLastAction().type).toContain(
      "progressiveOnboarding.dismiss"
    )
  })

  it("does not show the popover given isReady false", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: false } },
    })

    renderWithRelay({ MeCounts: () => ({ savedArtworks: 1 }) })
    expect(screen.getByText("Test Children")).toBeOnTheScreen()
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })

  it("does not show the popover when screen is not focused", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
      },
    })

    mockAddListener.mockImplementationOnce((event, callback) => {
      if (event === "blur") {
        callback()
      }
      return jest.fn() // return a function to mimic the unsubscribe function
    })

    renderWithRelay({ MeCounts: () => ({ savedArtworks: 1 }) })
    expect(screen.getByText("Test Children")).toBeOnTheScreen()
    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
  })
})

const MockedPopover: React.FC<any> = ({ children, onDismiss }) => {
  return (
    <>
      <Text onPress={onDismiss}>Popover</Text>
      {children}
    </>
  )
}

const MockedVisibleSentinel: React.FC<any> = ({ children, onChange }) => {
  useEffect(() => onChange(true), [])

  return <View>{children}</View>
}
