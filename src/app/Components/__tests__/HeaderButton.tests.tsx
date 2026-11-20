import { fireEvent, screen } from "@testing-library/react-native"
import { HeaderButton } from "app/Components/HeaderButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("HeaderButton", () => {
  it("renders children correctly", async () => {
    await renderWithWrappers(
      <HeaderButton position="left" onPress={jest.fn()}>
        <Text>Button Content</Text>
      </HeaderButton>
    )

    expect(screen.getByText("Button Content")).toBeTruthy()
  })

  it("handles onPress event", async () => {
    const onPressMock = jest.fn()

    await renderWithWrappers(
      <HeaderButton position="right" onPress={onPressMock}>
        <Text>Clickable Button</Text>
      </HeaderButton>
    )

    await fireEvent.press(screen.getByText("Clickable Button"))
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it("does not render when shouldHide is true", async () => {
    await renderWithWrappers(
      <HeaderButton position="left" onPress={jest.fn()} shouldHide>
        <Text>Hidden Button</Text>
      </HeaderButton>
    )

    expect(screen.queryByText("Hidden Button")).toBeNull()
  })
})
