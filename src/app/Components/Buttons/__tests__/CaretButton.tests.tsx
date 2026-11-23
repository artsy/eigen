import { screen } from "@testing-library/react-native"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CaretButton", () => {
  it("renders properly", () => {
    renderWithWrappers(<CaretButton text="I am a caret button" />)
    expect(screen.getByRole("button")).toBeOnTheScreen()
    expect(screen.getByRole("button")).toHaveTextContent(/I am a caret button/)
  })
})
