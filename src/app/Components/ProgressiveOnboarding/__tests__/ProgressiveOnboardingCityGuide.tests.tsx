import { ContextModule } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { ProgressiveOnboardingCityGuide } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingCityGuide"
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

jest.mock("app/utils/hooks/useDebouncedValue", () => ({
  useDebouncedValue: ({ value }: { value: boolean }) => ({ debouncedValue: value }),
}))

const mockUseIsFocused = jest.fn()

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: () => mockUseIsFocused(),
}))

describe("ProgressiveOnboardingCityGuide", () => {
  const renderTooltip = () =>
    renderWithWrappers(
      <ProgressiveOnboardingCityGuide
        onboardingKey="city-guide-curated-guides"
        title="Expert-curated Guides"
        description="Click to discover our art picks in cities across the globe."
        placement="bottom"
        contextModule={ContextModule.cityGuideCard}
      >
        <Text>City Guides</Text>
      </ProgressiveOnboardingCityGuide>
    )

  beforeEach(() => {
    mockUseIsFocused.mockReturnValue(true)
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true }, dismissed: [] },
    })
  })

  it("shows the title and description", () => {
    renderTooltip()

    expect(screen.getByText("City Guides")).toBeOnTheScreen()
    expect(screen.getByText("Expert-curated Guides")).toBeOnTheScreen()
    expect(
      screen.getByText("Click to discover our art picks in cities across the globe.")
    ).toBeOnTheScreen()
  })

  it("remembers the dismissal", () => {
    renderTooltip()

    fireEvent.press(screen.getByText("Dismiss"))

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(state?.progressiveOnboarding.dismissed).toStrictEqual([
      { key: "city-guide-curated-guides", timestamp: expect.any(Number) },
    ])
  })

  it("stays hidden once dismissed", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        dismissed: [{ key: "city-guide-curated-guides", timestamp: Date.now() }],
      },
    })

    renderTooltip()

    expect(screen.getByText("City Guides")).toBeOnTheScreen()
    expect(screen.queryByText("Expert-curated Guides")).not.toBeOnTheScreen()
  })

  it("stays hidden while the screen is not focused", () => {
    mockUseIsFocused.mockReturnValue(false)

    renderTooltip()

    expect(screen.queryByText("Expert-curated Guides")).not.toBeOnTheScreen()
  })
})

const MockedPopover: React.FC<any> = ({ children, onDismiss, visible, title, content }) => {
  if (!visible) {
    return <>{children}</>
  }

  return (
    <>
      {title}
      {content}
      <Text onPress={onDismiss}>Dismiss</Text>
      {children}
    </>
  )
}

const MockedVisibleSentinel: React.FC<any> = ({ children, onChange }) => {
  useEffect(() => onChange(true), [])

  return <View>{children}</View>
}
