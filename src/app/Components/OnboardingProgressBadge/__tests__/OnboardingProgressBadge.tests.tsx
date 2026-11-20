import { screen } from "@testing-library/react-native"
import { OnboardingProgressBadge } from "app/Components/OnboardingProgressBadge/OnboardingProgressBadge"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useReducedMotion } from "react-native-reanimated"

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  useReducedMotion: jest.fn(),
}))

const mockUseReducedMotion = useReducedMotion as jest.Mock

describe("OnboardingProgressBadge", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it("renders current and total for follows", async () => {
    await renderWithWrappers(<OnboardingProgressBadge current={2} total={5} unit="follows" />)

    expect(screen.getByText("2")).toBeOnTheScreen()
    expect(screen.getByText("of 5 follows")).toBeOnTheScreen()
  })

  it("renders current and total for saves", async () => {
    await renderWithWrappers(<OnboardingProgressBadge current={2} total={5} unit="saves" />)

    expect(screen.getByText("2")).toBeOnTheScreen()
    expect(screen.getByText("of 5 saves")).toBeOnTheScreen()
  })

  it("renders zero state", async () => {
    await renderWithWrappers(<OnboardingProgressBadge current={0} total={5} unit="saves" />)

    expect(screen.getByText("0")).toBeOnTheScreen()
    expect(screen.getByText("of 5 saves")).toBeOnTheScreen()
  })

  it("shows Complete once current reaches total", async () => {
    await renderWithWrappers(<OnboardingProgressBadge current={5} total={5} unit="saves" />)

    expect(screen.getByText("Complete")).toBeOnTheScreen()
    expect(screen.queryByText("5")).not.toBeOnTheScreen()
    expect(screen.queryByText("of 5 saves")).not.toBeOnTheScreen()
  })

  it("shows Complete when current exceeds total", async () => {
    await renderWithWrappers(<OnboardingProgressBadge current={7} total={5} unit="saves" />)

    expect(screen.getByText("Complete")).toBeOnTheScreen()
  })

  it("updates the count immediately, without a jump, when Reduce Motion is enabled", async () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { rerender } = await renderWithWrappers(
      <OnboardingProgressBadge current={2} total={5} unit="saves" />
    )

    await rerender(<OnboardingProgressBadge current={3} total={5} unit="saves" />)

    expect(screen.getByText("3")).toBeOnTheScreen()
    expect(screen.queryByText("2")).not.toBeOnTheScreen()
  })
})
