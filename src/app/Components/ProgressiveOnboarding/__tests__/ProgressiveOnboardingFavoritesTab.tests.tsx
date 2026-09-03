import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ProgressiveOnboardingFavoritesTab } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingFavoritesTab"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { useReducedMotion } from "react-native-reanimated"

const mockSwitchTab = jest.fn()

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Popover: (props: any) => <MockedPopover {...props} />,
}))

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  useReducedMotion: jest.fn(),
}))

const mockUseReducedMotion = useReducedMotion as jest.Mock

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
    mockUseReducedMotion.mockReturnValue(false)

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
      bottomTabs: {
        sessionState: {
          selectedTab: "home",
          favoritesTabArtworkOverride: null,
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

  describe("Reduced Motion enabled", () => {
    beforeEach(() => {
      mockUseReducedMotion.mockReturnValue(true)
    })

    it("shows the popover as soon as at least one artwork was saved during onboarding", async () => {
      render()

      await waitFor(() => {
        expect(screen.getByText("Popover")).toBeOnTheScreen()
      })
      expect(screen.getByText("Content")).toBeOnTheScreen()
    })

    it("does not show the popover when no artworks were saved during onboarding", () => {
      __globalStoreTestUtils__?.injectState({
        infiniteDiscovery: {
          sessionState: { newUserOnboardingSavedArtworks: [] },
        },
      })

      render()

      expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
      expect(screen.getByText("Content")).toBeOnTheScreen()
    })
  })

  describe("Reduced Motion disabled", () => {
    it("shows the popover as soon as at least one artwork was saved, if the onboarding goal was never reached (e.g. skipped early)", () => {
      render()

      expect(screen.getByText("Popover")).toBeOnTheScreen()
      expect(screen.getByText("Content")).toBeOnTheScreen()
    })

    it("does not show the popover just because artworks were saved, once the onboarding goal has been reached", () => {
      __globalStoreTestUtils__?.injectState({
        infiniteDiscovery: {
          sessionState: { newUserOnboardingGoalReached: true },
        },
      })

      render()

      expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
      expect(screen.getByText("Content")).toBeOnTheScreen()
    })

    it("shows the popover once the completion animation sets the favorites tab artwork override", async () => {
      __globalStoreTestUtils__?.injectState({
        infiniteDiscovery: {
          sessionState: { newUserOnboardingGoalReached: true },
        },
        bottomTabs: {
          sessionState: { favoritesTabArtworkOverride: { url: "https://example.com/artwork.jpg" } },
        },
      })

      render()

      await waitFor(() => {
        expect(screen.getByText("Popover")).toBeOnTheScreen()
      })
      expect(screen.getByText("Content")).toBeOnTheScreen()
    })
  })

  it("does not show popover when the current route is not home", () => {
    __globalStoreTestUtils__?.injectState({
      infiniteDiscovery: {
        sessionState: { newUserOnboardingGoalReached: true },
      },
      bottomTabs: {
        sessionState: { favoritesTabArtworkOverride: { url: "https://example.com/artwork.jpg" } },
      },
    })
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
      infiniteDiscovery: {
        sessionState: { newUserOnboardingGoalReached: true },
      },
      bottomTabs: {
        sessionState: { favoritesTabArtworkOverride: { url: "https://example.com/artwork.jpg" } },
      },
    })

    render()

    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("dismisses the popover, reverts the icon, switches to the favorites tab, and tracks the tap when pressed", async () => {
    __globalStoreTestUtils__?.injectState({
      infiniteDiscovery: {
        sessionState: { newUserOnboardingGoalReached: true },
      },
      bottomTabs: {
        sessionState: { favoritesTabArtworkOverride: { url: "https://example.com/artwork.jpg" } },
      },
    })

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
    expect(
      __globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState
        .favoritesTabArtworkOverride
    ).toBeNull()
  })

  it("dismisses the popover and reverts the icon when the user switches tabs without tapping it", async () => {
    __globalStoreTestUtils__?.injectState({
      infiniteDiscovery: {
        sessionState: { newUserOnboardingGoalReached: true },
      },
      bottomTabs: {
        sessionState: { favoritesTabArtworkOverride: { url: "https://example.com/artwork.jpg" } },
      },
    })

    render()

    await waitFor(() => {
      expect(screen.getByText("Popover")).toBeOnTheScreen()
    })

    GlobalStore.actions.bottomTabs.setSelectedTab("search")

    await waitFor(() => {
      expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    })
    expect(
      __globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.isDismissed("favorites-tab")
        .status
    ).toBe(true)
    expect(
      __globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState
        .favoritesTabArtworkOverride
    ).toBeNull()
  })

  it("reverts the icon when already on another tab, even though the tooltip never became visible", () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: {
        sessionState: {
          selectedTab: "search",
          favoritesTabArtworkOverride: { url: "https://example.com/artwork.jpg" },
        },
      },
    })

    render()

    expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    expect(
      __globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.isDismissed("favorites-tab")
        .status
    ).toBe(true)
    expect(
      __globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState
        .favoritesTabArtworkOverride
    ).toBeNull()
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
