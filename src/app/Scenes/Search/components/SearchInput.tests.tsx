import { fireEvent } from "@testing-library/react-native"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { SearchInput, SearchInputProps } from "./SearchInput"

describe("SearchInput", () => {
  const TestRenderer = (props: Partial<SearchInputProps>) => (
    <SearchInput {...defaultProps} {...props} />
  )

  it("renders without throwing an error", () => {
    const { getByPlaceholderText } = renderWithWrappers(<TestRenderer />)

    expect(getByPlaceholderText("Placeholder")).toBeTruthy()
  })

  it("should call handlers when the text is changed", () => {
    const onChangeTextMock = jest.fn()
    const refineMock = jest.fn()

    const { getByPlaceholderText } = renderWithWrappers(
      <TestRenderer onTextChange={onChangeTextMock} refine={refineMock} />
    )

    fireEvent.changeText(getByPlaceholderText("Placeholder"), "text")

    expect(onChangeTextMock).toBeCalledWith("text")
    expect(refineMock).toBeCalledWith("text")
  })

  it("should have the correct value prop", () => {
    const { getByPlaceholderText } = renderWithWrappers(<TestRenderer />)
    const searchInput = getByPlaceholderText("Placeholder")

    fireEvent.changeText(searchInput, "text")

    expect(searchInput).toHaveProp("value", "text")
  })

  it("track event when the text is changed", () => {
    const { getByPlaceholderText } = renderWithWrappers(<TestRenderer />)

    fireEvent.changeText(getByPlaceholderText("Placeholder"), "text")

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action_type": "Searched",
          "query": "text",
        },
      ]
    `)
  })

  it("track event when the text is cleared", () => {
    const { getByPlaceholderText, getByLabelText } = renderWithWrappers(<TestRenderer />)

    fireEvent.changeText(getByPlaceholderText("Placeholder"), "text")
    fireEvent.press(getByLabelText("Clear input button"))

    expect(mockTrackEvent.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action_type": "Cleared input in search screen",
        },
      ]
    `)
  })
})

const defaultProps: SearchInputProps = {
  placeholder: "Placeholder",
  currentRefinement: "refinement",
  refine: jest.fn(),
  onTextChange: jest.fn(),
}
