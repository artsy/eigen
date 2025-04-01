import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { TabEmptyState } from "./TabEmptyState"

describe("TabEmptyState", () => {
  it("renders the provided text", () => {
    const testText = "No items found"
    renderWithWrappers(<TabEmptyState text={testText} />)

    expect(screen.getByText(testText)).toBeTruthy()
  })
})
