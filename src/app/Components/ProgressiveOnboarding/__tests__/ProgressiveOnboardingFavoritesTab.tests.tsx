import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ProgressiveOnboardingFavoritesTab } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingFavoritesTab"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

const mockSwitchTab = jest.fn()

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Popover: (props: any) => <MockedPopover {...props} />,
}))

jest.mock("app/utils/hooks/useDebouncedValue", () => {
  return {
    useDebouncedValue: ({ value }: { value: string }) => ({ debouncedValue: value }),
  }
})

jest.mock("app/Navigation/Navigation", () => ({
  ...jest.requireActual("app/Navigation/Navigation"),
  internal_navigationRef: {
    current: {
      getCurrentRoute: () => ({
        name: "Home",
      }),
    },
  },
}))

jest.mock("app/system/navigation/navigate", () => ({
  switchTab: (...args: any[]) => mockSwitchTab(...args),
}))

describe("ProgressiveOnboardingFavoritesTab", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [],
      },
      infiniteDiscovery: {
        sessionState: {
          newUserOnboardingSavedArtworks: [{ internalID: "artwork-1", url: "https://example.com" }],
        },
      },
    })

    jest.spyOn(internal_navigationRef.current as any, "getCurrentRoute").mockReturnValue({
      name: "Home",
    } as any)
  })

  const render = () =>
    renderWithWrappers(
      <ProgressiveOnboardingFavoritesTab>
        <Text>Content</Text>
      </ProgressiveOnboardingFavoritesTab>
    )

  it("shows popover when at least one artwork was saved during onboarding", async () => {
    render()

    await waitFor(() => {
      expect(screen.getByText("Popover")).toBeOnTheScreen()
    })
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("does not show popover when no artworks were saved during onboarding", () => {
    __globalStoreTestUtils__?.injectState({
      infiniteDiscovery: {
        sessionState: { newUserOnboardingSavedArtworks: [] },
      },
    })

    render()

    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("does not show popover when the current route is not home", () => {
    jest.spyOn(internal_navigationRef.current as any, "getCurrentRoute").mockReturnValue({
      name: "Search",
    })

    render()

    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("does not show popover when it has already been dismissed", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        dismissed: [{ key: "favorites-tab", timestamp: Date.now() }],
      },
    })

    render()

    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("dismisses the popover, switches to the favorites tab, and tracks the tap when pressed", async () => {
    render()

    await waitFor(() => {
      expect(screen.getByText("Popover")).toBeOnTheScreen()
    })

    fireEvent.press(screen.getByText("Your saves get stored here."))

    expect(mockSwitchTab).toHaveBeenCalledWith("favorites")
    expect(mockTrackEvent).toHaveBeenCalledWith(expect.objectContaining({ type: "favorites-tab" }))
    expect(
      __globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.isDismissed("favorites-tab")
        .status
    ).toBe(true)
  })
})

const MockedPopover: React.FC<any> = ({ children, onDismiss, visible, title, content }) => {
  if (!visible) {
    return <>{children}</>
  }

  return (
    <>
      <Text onPress={onDismiss}>Popover</Text>
      {title}
      {content}
      <>{children}</>
    </>
  )
}
