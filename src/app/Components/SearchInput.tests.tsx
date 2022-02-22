import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import * as input from "palette/elements/Input/Input"
import React from "react"
import { TextInput } from "react-native"
import Animated, { Easing } from "react-native-reanimated"
import { SearchInput, SearchInputProps } from "./SearchInput"

const emitInputClearEventSpy = jest.spyOn(input, "emitInputClearEvent")

describe("SearchInput", () => {
  const onCancelPressMock = jest.fn()
  const animatedTimingSpy = jest.spyOn(Animated, "timing")

  const TestWrapper = (props: SearchInputProps) => {
    const ref = { current: null as null | TextInput }
    return (
      <SearchInput
        ref={ref}
        onCancelPress={onCancelPressMock}
        placeholder="Type something..."
        {...props}
      />
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders input", () => {
    const { getByPlaceholderText } = renderWithWrappersTL(<TestWrapper />)
    expect(getByPlaceholderText("Type something...")).toBeDefined()
  })

  it(`calls "Animated.timing" with value 1 when focusing the input`, () => {
    const { getByPlaceholderText } = renderWithWrappersTL(<TestWrapper enableCancelButton />)
    fireEvent(getByPlaceholderText("Type something..."), "focus")
    expect(animatedTimingSpy).toHaveBeenCalledTimes(1)
    expect(animatedTimingSpy.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        duration: 180,
        easing: Easing.ease,
        toValue: 1,
      })
    )
  })

  it(`calls "Animated.timing" with value 0 when blurring the input`, () => {
    const { getByPlaceholderText } = renderWithWrappersTL(<TestWrapper enableCancelButton />)
    fireEvent(getByPlaceholderText("Type something..."), "blur")
    expect(animatedTimingSpy).toHaveBeenCalledTimes(1)
    expect(animatedTimingSpy.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        duration: 180,
        easing: Easing.ease,
        toValue: 0,
      })
    )
  })

  it(`doesn't render "Cancel" button when "enableCancelButton" is not passed`, () => {
    const { queryAllByText } = renderWithWrappersTL(<TestWrapper />)
    // Cancel text is wrapped by Sans and Animated.Text so we get 2 elements here
    expect(queryAllByText("Cancel")).toHaveLength(0)
  })

  it(`renders "Cancel" button when "enableCancelButton" is passed`, () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper enableCancelButton />)
    expect(getByText("Cancel")).toBeDefined()
  })

  it(`calls passed "onCancelPress" callback and emits "clear" event when pressing on "Cancel" button`, () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper enableCancelButton />)
    fireEvent.press(getByText("Cancel"))
    expect(onCancelPressMock).toHaveBeenCalled()
    expect(emitInputClearEventSpy).toHaveBeenCalled()
  })

  it(`hides "x" button when pressing "Cancel"`, () => {
    const { getByText, getByA11yLabel, queryAllByA11yLabel, getByPlaceholderText } =
      renderWithWrappersTL(<TestWrapper enableCancelButton />)
    const searchInput = getByPlaceholderText("Type something...")
    fireEvent(searchInput, "changeText", "text")
    expect(getByA11yLabel("Clear input button")).toBeTruthy()
    fireEvent.press(getByText("Cancel"))
    expect(queryAllByA11yLabel("Clear input button")).toHaveLength(0)
  })

  it('should hide "Cancel" when it is pressed', () => {
    const { queryAllByA11yLabel, getByText, findAllByA11yLabel, getByPlaceholderText } =
      renderWithWrappersTL(<TestWrapper enableCancelButton />)

    fireEvent.changeText(getByPlaceholderText("Type something..."), "text")
    expect(findAllByA11yLabel("Cancel")).toBeTruthy()

    fireEvent.press(getByText("Cancel"))
    expect(queryAllByA11yLabel("Cancel")).toHaveLength(0)
  })
})
