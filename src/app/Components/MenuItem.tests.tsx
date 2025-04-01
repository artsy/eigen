import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { MenuItem } from "./MenuItem"

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

  it("renders with value and text", () => {
    renderWithWrappers(<MenuItem title="Menu Item" value="Value text" text="Additional text" />)

    expect(screen.getByText("Menu Item")).toBeTruthy()
    expect(screen.getByText("Value text")).toBeTruthy()
    expect(screen.getByText("Additional text")).toBeTruthy()
  })

  it("shows Beta label when isBeta is true", () => {
    renderWithWrappers(<MenuItem title="Beta Feature" isBeta />)

    expect(screen.getByText("Beta Feature")).toBeTruthy()
    expect(screen.getByText("Beta")).toBeTruthy()
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
