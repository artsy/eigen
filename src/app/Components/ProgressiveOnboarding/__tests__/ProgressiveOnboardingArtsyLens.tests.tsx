import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { ProgressiveOnboardingArtsyLens } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingArtsyLens"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
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

describe("ProgressiveOnboardingArtsyLens", () => {
  const originalLaunchCount = ArtsyNativeModule.launchCount
  const renderTooltip = (
    isSearchOverlayVisible = false,
    ownerType: OwnerType.home | OwnerType.search = OwnerType.home
  ) =>
    renderWithWrappers(
      <ProgressiveOnboardingArtsyLens
        isSearchOverlayVisible={isSearchOverlayVisible}
        ownerType={ownerType}
      >
        <Text>Camera</Text>
      </ProgressiveOnboardingArtsyLens>
    )

  beforeEach(() => {
    jest.clearAllMocks()
    ArtsyNativeModule.launchCount = 3
    mockUseIsFocused.mockReturnValue(true)
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: {
          isReady: true,
          activePopover: undefined,
          deferHomeTooltipsThisSession: false,
        },
        dismissed: [],
      },
    })
  })

  afterEach(() => {
    ArtsyNativeModule.launchCount = originalLaunchCount
  })

  it.each([OwnerType.home, OwnerType.search] as const)(
    "stays hidden on %s during the first two launches",
    async (ownerType) => {
      for (const launchCount of [1, 2]) {
        ArtsyNativeModule.launchCount = launchCount
        const { unmount } = await renderTooltip(false, ownerType)

        expect(screen.queryByText("Artsy Lens")).not.toBeOnTheScreen()
        expect(mockTrackEvent).not.toHaveBeenCalled()
        expect(
          __globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.sessionState
            .activePopover
        ).toBeUndefined()

        await unmount()
      }
    }
  )

  it.each([3, 4])("can appear from launch %s onwards", async (launchCount) => {
    ArtsyNativeModule.launchCount = launchCount
    await renderTooltip()

    expect(await screen.findByText("Artsy Lens")).toBeOnTheScreen()
  })

  it("shows the Artsy Lens copy and tracks the view", async () => {
    await renderTooltip()

    expect(await screen.findByText("Artsy Lens")).toBeOnTheScreen()
    expect(screen.getByText("Take a picture of a work to find more like it")).toBeOnTheScreen()
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tooltipViewed",
      context_owner_type: "home",
      context_module: "header",
      type: "artsy-lens",
    })
    expect(__globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.dismissed).toEqual([])
  })

  it("remembers dismissal and does not show the tooltip again", async () => {
    const { unmount } = await renderTooltip()

    expect(await screen.findByText("Artsy Lens")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Dismiss"))

    expect(__globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.dismissed).toEqual([
      { key: "artsy-lens", timestamp: expect.any(Number) },
    ])

    await unmount()
    await renderTooltip(false, OwnerType.search)

    expect(screen.queryByText("Artsy Lens")).not.toBeOnTheScreen()
  })

  it("can first appear on Search and tracks Search as its context", async () => {
    await renderTooltip(false, OwnerType.search)

    expect(await screen.findByText("Artsy Lens")).toBeOnTheScreen()
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tooltipViewed",
      context_owner_type: "search",
      context_module: "header",
      type: "artsy-lens",
    })
  })

  it("waits until Home is focused", async () => {
    mockUseIsFocused.mockReturnValue(false)
    await renderTooltip()

    expect(screen.queryByText("Artsy Lens")).not.toBeOnTheScreen()
  })

  it("waits while another progressive onboarding popover is active", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { activePopover: "another-popover" } },
    })

    await renderTooltip()

    expect(screen.queryByText("Artsy Lens")).not.toBeOnTheScreen()
    expect(
      __globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.sessionState.activePopover
    ).toBe("another-popover")
  })

  it("waits when Home tooltips are deferred for this session", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { deferHomeTooltipsThisSession: true } },
    })

    await renderTooltip()

    expect(screen.queryByText("Artsy Lens")).not.toBeOnTheScreen()
  })

  it("can still appear on Search when Home tooltips are deferred", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { deferHomeTooltipsThisSession: true } },
    })

    await renderTooltip(false, OwnerType.search)

    expect(await screen.findByText("Artsy Lens")).toBeOnTheScreen()
  })

  it("stays hidden behind the search overlay", async () => {
    await renderTooltip(true)

    expect(screen.queryByText("Artsy Lens")).not.toBeOnTheScreen()
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
