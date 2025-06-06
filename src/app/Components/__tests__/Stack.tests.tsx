import { screen } from "@testing-library/react-native"
import { Stack } from "app/Components/Stack"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("Stack", () => {
  it("renders children in vertical layout by default", () => {
    renderWithWrappers(
      <Stack>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </Stack>
    )

    expect(screen.getByText("Item 1")).toBeTruthy()
    expect(screen.getByText("Item 2")).toBeTruthy()
    expect(screen.getByText("Item 3")).toBeTruthy()
  })

  it("renders children in horizontal layout when specified", () => {
    renderWithWrappers(
      <Stack horizontal>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </Stack>
    )

    expect(screen.getByText("Item 1")).toBeTruthy()
    expect(screen.getByText("Item 2")).toBeTruthy()
    expect(screen.getByText("Item 3")).toBeTruthy()
  })
})
