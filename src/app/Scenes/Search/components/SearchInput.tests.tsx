import { fireEvent, screen } from "@testing-library/react-native"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { SearchInput, SearchInputProps } from "./SearchInput"

describe("SearchInput", () => {
  const TestRenderer = (props: Partial<SearchInputProps>) => (
    <SearchInput {...defaultProps} {...props} />
  )

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)

    expect(screen.getByTestId("search-input")).toBeTruthy()
  })

  it("should call handlers when the text is changed", () => {
    const onChangeTextMock = jest.fn()
    const refineMock = jest.fn()

    renderWithWrappers(<TestRenderer onTextChange={onChangeTextMock} refine={refineMock} />)

    fireEvent.changeText(screen.getByTestId("search-input"), "text")

    expect(onChangeTextMock).toBeCalledWith("text")
    expect(refineMock).toBeCalledWith("text")
  })

  it("should have the correct value prop", () => {
    renderWithWrappers(<TestRenderer />)
    const searchInput = screen.getByTestId("search-input")

    fireEvent.changeText(searchInput, "text")

    expect(searchInput).toHaveProp("value", "text")
  })

  it("track event when the text is changed", () => {
    renderWithWrappers(<TestRenderer />)

    fireEvent.changeText(screen.getByTestId("search-input"), "text")

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action_type": "Searched",
          "query": "text",
        },
      ]
    `)
  })

  it("track event when the text is cleared", () => {
    renderWithWrappers(<TestRenderer />)

    fireEvent.changeText(screen.getByTestId("search-input"), "text")
    fireEvent.press(screen.getByTestId("clear-input-button"))

    expect(mockTrackEvent.mock.calls[1]).toMatchInlineSnapshot(`
      [
        {
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
