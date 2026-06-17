import { screen } from "@testing-library/react-native"
import { OnboardingProgressBadge } from "app/Components/OnboardingProgressBadge/OnboardingProgressBadge"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("OnboardingProgressBadge", () => {
  it("renders current and total", () => {
    renderWithWrappers(<OnboardingProgressBadge current={2} total={5} />)

    expect(screen.getByText("2/5")).toBeOnTheScreen()
  })

  it("renders zero state", () => {
    renderWithWrappers(<OnboardingProgressBadge current={0} total={5} />)

    expect(screen.getByText("0/5")).toBeOnTheScreen()
  })

  it("caps the displayed count at total when current exceeds it", () => {
    renderWithWrappers(<OnboardingProgressBadge current={7} total={5} />)

    expect(screen.getByText("5/5")).toBeOnTheScreen()
  })
})
