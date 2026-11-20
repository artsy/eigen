import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ComponentName } from "../ComponentName"

describe("ComponentName", () => {
  it("renders correctly", async () => {
    await renderWithWrappers(<ComponentName />)

    expect(screen.getByText("Expected Text")).toBeOnTheScreen()
  })

  it("handles user interaction", async () => {
    await renderWithWrappers(<ComponentName />)

    await fireEvent.press(screen.getByTestId("button-id"))

    // Add assertions here
  })
})
