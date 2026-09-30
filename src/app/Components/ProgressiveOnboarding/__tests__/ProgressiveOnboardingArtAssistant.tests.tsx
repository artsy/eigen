import { fireEvent, screen } from "@testing-library/react-native"
import { ProgressiveOnboardingArtAssistant } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingArtAssistant"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useEffect, useRef } from "react"
import { Text, View } from "react-native"

jest.mock("app/utils/Sentinel", () => ({
  Sentinel: (props: any) => <MockedVisibleSentinel {...props} />,
}))

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Popover: (props: any) => <MockedPopover {...props} />,
}))

jest.mock("app/utils/hooks/useDebouncedValue", () => ({
  useDebouncedValue: ({ value }: { value: boolean }) => ({ debouncedValue: value }),
}))

const mockUseIsFocused = jest.fn()

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: () => mockUseIsFocused(),
}))

describe("ProgressiveOnboardingArtAssistant", () => {
  const renderTooltip = (isSearchOverlayVisible = false) =>
    renderWithWrappers(
      <ProgressiveOnboardingArtAssistant isSearchOverlayVisible={isSearchOverlayVisible}>
        <Text>Assistant button</Text>
      </ProgressiveOnboardingArtAssistant>
    )

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseIsFocused.mockReturnValue(true)
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true, activePopover: undefined },
        dismissed: [],
      },
    })
  })

  it("shows the two-line copy with a Beta badge and tracks the view", async () => {
    renderTooltip()

    expect(await screen.findByText("Art Assistant")).toBeOnTheScreen()
    expect(screen.getByText("Beta")).toBeOnTheScreen()
    expect(screen.getByText("Describe what you want and we'll find it")).toBeOnTheScreen()
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tooltipViewed",
      context_owner_type: "search",
      context_module: "header",
      type: "art-assistant",
    })
    expect(__globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.dismissed).toEqual([])
  })

  it("remembers dismissal and does not show the tooltip again", async () => {
    const { unmount } = renderTooltip()

    fireEvent.press(await screen.findByText("Dismiss"))

    expect(__globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.dismissed).toEqual([
      { key: "art-assistant", timestamp: expect.any(Number) },
    ])

    unmount()
    renderTooltip()

    expect(screen.queryByText("Art Assistant")).not.toBeOnTheScreen()
  })

  it("waits while another popover is active", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true, activePopover: "other" } },
    })

    renderTooltip()

    expect(screen.queryByText("Art Assistant")).not.toBeOnTheScreen()
  })

  it("stays hidden behind the search overlay", () => {
    renderTooltip(true)

    expect(screen.queryByText("Art Assistant")).not.toBeOnTheScreen()
  })
})

const MockedVisibleSentinel: React.FC<any> = ({ children, onChange }) => {
  useEffect(() => onChange(true), [onChange])

  return <View>{children}</View>
}

const MockedPopover: React.FC<any> = ({
  children,
  content,
  onCloseComplete,
  onDismiss,
  onOpenComplete,
  title,
  visible,
}) => {
  const wasVisible = useRef(false)

  useEffect(() => {
    if (visible && !wasVisible.current) {
      onOpenComplete()
    }
    wasVisible.current = visible
  }, [visible, onOpenComplete])

  if (!visible) {
    return <>{children}</>
  }

  return (
    <>
      {title}
      {content}
      <Text
        onPress={() => {
          onDismiss()
          onCloseComplete()
        }}
      >
        Dismiss
      </Text>
      {children}
    </>
  )
}
