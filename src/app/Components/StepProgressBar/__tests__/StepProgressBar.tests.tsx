import { screen } from "@testing-library/react-native"
import { StepProgressBar } from "app/Components/StepProgressBar/StepProgressBar"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("StepProgressBar", () => {
  it("does not show the checkmark before completion", () => {
    renderWithWrappers(<StepProgressBar current={2} total={5} />)

    expect(screen.queryByTestId("step-progress-bar-checkmark")).not.toBeOnTheScreen()
  })

  it("shows the checkmark once current reaches total", () => {
    renderWithWrappers(<StepProgressBar current={5} total={5} />)

    expect(screen.getByTestId("step-progress-bar-checkmark")).toBeOnTheScreen()
  })

  it("shows the checkmark when current exceeds total", () => {
    renderWithWrappers(<StepProgressBar current={7} total={5} />)

    expect(screen.getByTestId("step-progress-bar-checkmark")).toBeOnTheScreen()
  })

  it("renders the progress track", () => {
    renderWithWrappers(<StepProgressBar current={0} total={5} />)

    expect(screen.getByTestId("progress-bar-track")).toBeOnTheScreen()
  })
})
