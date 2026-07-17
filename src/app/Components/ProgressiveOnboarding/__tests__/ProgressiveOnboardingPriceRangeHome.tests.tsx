import { screen, waitFor } from "@testing-library/react-native"
import { ProgressiveOnboardingPriceRangeHome } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPriceRangeHome"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
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

describe("ProgressiveOnboardingPriceRangeHome", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <ProgressiveOnboardingPriceRangeHome>
        <Text>Content</Text>
      </ProgressiveOnboardingPriceRangeHome>
    ),
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [],
      },
      onboarding: {
        showFollowedArtistSummaryBottomSheet: false,
      },
    })

    jest.spyOn(internal_navigationRef.current as any, "getCurrentRoute").mockReturnValue({
      name: "Home",
    } as any)
  })

  it("shows popover when all conditions are met", async () => {
    renderWithRelay(mockProps)

    await waitFor(() => {
      expect(screen.getByText("Popover")).toBeOnTheScreen()
    })
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("does not show popover when the current route is not home", async () => {
    jest.spyOn(internal_navigationRef.current as any, "getCurrentRoute").mockReturnValue({
      name: "Search",
    })

    renderWithRelay(mockProps)

    await waitFor(() => {
      expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    })
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("does not show popover when the user has a price range", async () => {
    renderWithRelay({
      Me: () => ({
        hasPriceRange: true,
      }),
    })

    await waitFor(() => {
      expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    })
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("does not show popover when the user has seen the popover before", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        dismissed: [{ key: "price-range-popover-home", timestamp: Date.now() }],
      },
      onboarding: {
        showFollowedArtistSummaryBottomSheet: false,
      },
    })

    renderWithRelay(mockProps)

    await waitFor(() => {
      expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    })
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("does not show popover when the artist summary bottom sheet is currently showing", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [],
      },
      onboarding: {
        showFollowedArtistSummaryBottomSheet: true,
      },
    })

    renderWithRelay(mockProps)

    await waitFor(() => {
      expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    })
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })

  it("does not show popover when Home tooltips are deferred to the next session", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true, deferHomeTooltipsThisSession: true },
        dismissed: [],
      },
      onboarding: {
        showFollowedArtistSummaryBottomSheet: false,
      },
    })

    renderWithRelay(mockProps)

    await waitFor(() => {
      expect(screen.queryByText("Popover")).not.toBeOnTheScreen()
    })
    expect(screen.getByText("Content")).toBeOnTheScreen()
  })
})

const mockProps = {
  Me: () => ({
    hasPriceRange: false,
  }),
}

const MockedVisibleSentinel: React.FC<any> = ({ children, onChange }) => {
  useEffect(() => onChange(true), [onChange])

  return <View>{children}</View>
}

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
