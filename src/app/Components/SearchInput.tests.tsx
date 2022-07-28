import { fireEvent, waitFor } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import * as input from "palette/elements/Input/Input"
import { TextInput } from "react-native"
import { withReanimatedTimer } from "react-native-reanimated/src/reanimated2/jestUtils"
import { SearchInput, SearchInputProps } from "./SearchInput"

const emitInputClearEventSpy = jest.spyOn(input, "emitInputClearEvent")

describe("SearchInput", () => {
  const onCancelPressMock = jest.fn()

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
    jest.useRealTimers()
  })

  it("renders input", () => {
    withReanimatedTimer(async () => {
      const { getByPlaceholderText } = renderWithWrappers(<TestWrapper />)
      expect(getByPlaceholderText("Type something...")).toBeDefined()
    })
  })

  it(`doesn't render "Cancel" button when "enableCancelButton" is not passed`, () => {
    withReanimatedTimer(async () => {
      const { queryByText } = renderWithWrappers(<TestWrapper />)

      expect(queryByText("Cancel")).toBeNull()
    })
  })

  it(`renders "Cancel" button when "enableCancelButton" is passed`, () => {
    withReanimatedTimer(async () => {
      const { getByText } = renderWithWrappers(<TestWrapper enableCancelButton />)
      await waitFor(() => expect(getByText("Cancel")).toBeTruthy())
    })
  })

  it(`calls passed "onCancelPress" callback and emits "clear" event when pressing on "Cancel" button`, () => {
    withReanimatedTimer(async () => {
      const { getByText } = renderWithWrappers(<TestWrapper enableCancelButton />)
      await waitFor(() => expect(getByText("Cancel")).toBeTruthy())
      fireEvent.press(getByText("Cancel"))
      expect(onCancelPressMock).toHaveBeenCalled()
      expect(emitInputClearEventSpy).toHaveBeenCalled()
    })
  })

  it(`hides "x" button when pressing "Cancel"`, () => {
    withReanimatedTimer(async () => {
      const { getByText, getByLabelText, queryAllByLabelText, getByPlaceholderText } =
        renderWithWrappers(<TestWrapper enableCancelButton />)
      await waitFor(() => expect(getByText("Cancel")).toBeTruthy())
      const searchInput = getByPlaceholderText("Type something...")
      fireEvent(searchInput, "changeText", "text")
      expect(getByLabelText("Clear input button")).toBeTruthy()
      fireEvent.press(getByText("Cancel"))
      expect(queryAllByLabelText("Clear input button")).toHaveLength(0)
    })
  })

  it('should hide "Cancel" when it is pressed', () => {
    withReanimatedTimer(async () => {
      const { queryAllByLabelText, getByText, findAllByLabelText, getByPlaceholderText } =
        renderWithWrappers(<TestWrapper enableCancelButton />)

      await waitFor(() => expect(getByText("Cancel")).toBeTruthy())
      fireEvent.changeText(getByPlaceholderText("Type something..."), "text")
      expect(findAllByLabelText("Cancel")).toBeTruthy()

      fireEvent.press(getByText("Cancel"))
      expect(queryAllByLabelText("Cancel")).toHaveLength(0)
    })
  })
})
