import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import * as input from "palette/elements/Input/Input"
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
    const { getByPlaceholderText } = renderWithWrappers(<TestWrapper />)
    expect(getByPlaceholderText("Type something...")).toBeDefined()
  })

  it(`calls "Animated.timing" with value 1 when focusing the input`, () => {
    const { getByPlaceholderText } = renderWithWrappers(<TestWrapper enableCancelButton />)
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
    const { getByPlaceholderText } = renderWithWrappers(<TestWrapper enableCancelButton />)
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
    const { queryByText } = renderWithWrappers(<TestWrapper />)

    expect(queryByText("Cancel")).toBeNull()
  })

  it(`renders "Cancel" button when "enableCancelButton" is passed`, () => {
    const { getByText } = renderWithWrappers(<TestWrapper enableCancelButton />)
    expect(getByText("Cancel")).toBeDefined()
  })

  it(`calls passed "onCancelPress" callback and emits "clear" event when pressing on "Cancel" button`, () => {
    const { getByText } = renderWithWrappers(<TestWrapper enableCancelButton />)
    fireEvent.press(getByText("Cancel"))
    expect(onCancelPressMock).toHaveBeenCalled()
    expect(emitInputClearEventSpy).toHaveBeenCalled()
  })

  it(`hides "x" button when pressing "Cancel"`, () => {
    const { getByText, getByLabelText, queryAllByLabelText, getByPlaceholderText } =
      renderWithWrappers(<TestWrapper enableCancelButton />)
    const searchInput = getByPlaceholderText("Type something...")
    fireEvent(searchInput, "changeText", "text")
    expect(getByLabelText("Clear input button")).toBeTruthy()
    fireEvent.press(getByText("Cancel"))
    expect(queryAllByLabelText("Clear input button")).toHaveLength(0)
  })

  it('should hide "Cancel" when it is pressed', () => {
    const { queryAllByLabelText, getByText, findAllByLabelText, getByPlaceholderText } =
      renderWithWrappers(<TestWrapper enableCancelButton />)

    fireEvent.changeText(getByPlaceholderText("Type something..."), "text")
    expect(findAllByLabelText("Cancel")).toBeTruthy()

    fireEvent.press(getByText("Cancel"))
    expect(queryAllByLabelText("Cancel")).toHaveLength(0)
  })
})
