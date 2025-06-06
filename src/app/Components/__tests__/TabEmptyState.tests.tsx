import { screen } from "@testing-library/react-native"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("TabEmptyState", () => {
  it("renders the provided text", () => {
    const testText = "No items found"
    renderWithWrappers(<TabEmptyState text={testText} />)

    expect(screen.getByText(testText)).toBeTruthy()
  })
})
