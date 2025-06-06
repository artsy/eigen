import { fireEvent, screen } from "@testing-library/react-native"
import { TouchableRow } from "app/Components/TouchableRow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("TouchableRow", () => {
  it("renders children correctly", () => {
    renderWithWrappers(
      <TouchableRow>
        <Text>Row Content</Text>
      </TouchableRow>
    )

    expect(screen.getByText("Row Content")).toBeTruthy()
  })

  it("handles onPress event", () => {
    const onPressMock = jest.fn()

    renderWithWrappers(
      <TouchableRow onPress={onPressMock}>
        <Text>Clickable Row</Text>
      </TouchableRow>
    )

    fireEvent.press(screen.getByText("Clickable Row"))
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it("renders as disabled", () => {
    const onPressMock = jest.fn()

    renderWithWrappers(
      <TouchableRow onPress={onPressMock} disabled>
        <Text>Disabled Row</Text>
      </TouchableRow>
    )

    // The disabled prop prevents onPress from being called
    fireEvent.press(screen.getByText("Disabled Row"))
    expect(onPressMock).not.toHaveBeenCalled()
  })
})
