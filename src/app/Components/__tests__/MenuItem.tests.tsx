import { screen } from "@testing-library/react-native"
import { MenuItem } from "app/Components/MenuItem"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

// Simple mock of RouterLink that doesn't try to simulate click behavior
jest.mock("app/system/navigation/RouterLink", () => {
  return {
    RouterLink: ({ children }: any) => children,
  }
})

describe("MenuItem", () => {
  it("renders with title and description", () => {
    renderWithWrappers(<MenuItem title="Test Title" description="Test description" />)

    expect(screen.getByText("Test Title")).toBeTruthy()
    expect(screen.getByText("Test description")).toBeTruthy()
  })

  it("renders with value", () => {
    renderWithWrappers(<MenuItem title="Menu Item" value="Value text" />)

    expect(screen.getByText("Menu Item")).toBeTruthy()
    expect(screen.getByText("Value text")).toBeTruthy()
  })

  it("renders with custom icon and rightView", () => {
    renderWithWrappers(
      <MenuItem title="Custom Item" icon={<Text>Icon</Text>} rightView={<Text>Right View</Text>} />
    )

    expect(screen.getByText("Custom Item")).toBeTruthy()
    expect(screen.getByText("Icon")).toBeTruthy()
    expect(screen.getByText("Right View")).toBeTruthy()
  })
})
