import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { Sentinel } from "./Sentinel"

const mockOnChange = jest.fn()

const TestComponentWithSentinel = () => {
  return (
    <Sentinel onChange={mockOnChange}>
      <Text testID="child-content">Test Child</Text>
    </Sentinel>
  )
}

describe("Sentinel", () => {
  it("renders child components", () => {
    renderWithWrappers(<TestComponentWithSentinel />)
    expect(screen.getByTestId("child-content")).toBeDefined()
  })
})
