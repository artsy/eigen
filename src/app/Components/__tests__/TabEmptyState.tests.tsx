import { screen } from "@testing-library/react-native"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("TabEmptyState", () => {
  it("renders the provided text", async () => {
    const testText = "No items found"
    await renderWithWrappers(<TabEmptyState text={testText} />)

    expect(screen.getByText(testText)).toBeTruthy()
  })
})
