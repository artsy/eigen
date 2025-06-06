import { screen } from "@testing-library/react-native"
import { Disappearable } from "app/Components/Disappearable"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createRef } from "react"
import { Text } from "react-native"

describe("Disappearable", () => {
  it("renders children correctly", () => {
    renderWithWrappers(
      <Disappearable>
        <Text>Test Content</Text>
      </Disappearable>
    )

    expect(screen.getByText("Test Content")).toBeTruthy()
  })

  it("provides disappear method via ref", () => {
    const ref = createRef<Disappearable>()

    renderWithWrappers(
      <Disappearable ref={ref}>
        <Text>Disappearing Content</Text>
      </Disappearable>
    )

    expect(ref.current).toBeTruthy()
    expect(typeof ref.current?.disappear).toBe("function")
  })
})
