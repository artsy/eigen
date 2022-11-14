import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Pill } from "./Pill"

describe("<Pill />", () => {
  it("invokes the onClick callback", () => {
    const onPress = jest.fn()

    const { getByText } = renderWithWrappers(<Pill onPress={onPress}>wow</Pill>)

    fireEvent.press(getByText("wow"))
    expect(onPress).toHaveBeenCalled()
  })

  it("should not be pressable if disabled is passed", () => {
    const onPress = jest.fn()

    const { getByText } = renderWithWrappers(
      <Pill disabled onPress={onPress}>
        Press me
      </Pill>
    )

    fireEvent.press(getByText("Press me"))
    expect(onPress).not.toHaveBeenCalled()
  })

  it("should display placeholder", () => {
    const { getByText } = renderWithWrappers(
      <Pill placeholder="Placeholder" onPress={jest.fn}>
        Label
      </Pill>
    )

    expect(getByText(/Label/)).toBeTruthy()
    expect(getByText(/Placeholder/)).toBeTruthy()
  })
})
