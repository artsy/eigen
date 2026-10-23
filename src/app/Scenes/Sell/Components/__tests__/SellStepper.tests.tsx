import { screen } from "@testing-library/react-native"
import { SellStepper } from "app/Scenes/Sell/Components/SellStepper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SellStepper", () => {
  it("reads as a single step label", () => {
    renderWithWrappers(<SellStepper currentStepIndex={1} />)

    expect(screen.getByLabelText("Step 2 of 3")).toBeOnTheScreen()
  })
})
