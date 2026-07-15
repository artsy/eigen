import { screen } from "@testing-library/react-native"
import { OnboardingProgressBadge } from "app/Components/OnboardingProgressBadge/OnboardingProgressBadge"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("OnboardingProgressBadge", () => {
  it("renders current and total for follows", () => {
    renderWithWrappers(<OnboardingProgressBadge current={2} total={5} unit="follows" />)

    expect(screen.getByText("2 of 5 follows")).toBeOnTheScreen()
  })

  it("renders current and total for saves", () => {
    renderWithWrappers(<OnboardingProgressBadge current={2} total={5} unit="saves" />)

    expect(screen.getByText("2 of 5 saves")).toBeOnTheScreen()
  })

  it("renders zero state", () => {
    renderWithWrappers(<OnboardingProgressBadge current={0} total={5} unit="saves" />)

    expect(screen.getByText("0 of 5 saves")).toBeOnTheScreen()
  })

  it("shows Complete once current reaches total", () => {
    renderWithWrappers(<OnboardingProgressBadge current={5} total={5} unit="saves" />)

    expect(screen.getByText("Complete")).toBeOnTheScreen()
    expect(screen.queryByText("5 of 5 saves")).not.toBeOnTheScreen()
  })

  it("shows Complete when current exceeds total", () => {
    renderWithWrappers(<OnboardingProgressBadge current={7} total={5} unit="saves" />)

    expect(screen.getByText("Complete")).toBeOnTheScreen()
  })
})
