import { fireEvent } from "@testing-library/react-native"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { SearchInput, SearchInputProps } from "./SearchInput"

describe("SearchInput", () => {
  const TestRenderer = (props: Partial<SearchInputProps>) => {
    return <SearchInput {...defaultProps} {...props} />
  }

  it("renders without throwing an error", () => {
    const { getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)

    expect(getByPlaceholderText("Placeholder")).toBeTruthy()
  })

  it("should call handlers when the text is changed", () => {
    const onChangeTextMock = jest.fn()
    const refineMock = jest.fn()

    const { getByPlaceholderText } = renderWithWrappersTL(
      <TestRenderer onTextChange={onChangeTextMock} refine={refineMock} />
    )

    fireEvent.changeText(getByPlaceholderText("Placeholder"), "text")

    expect(onChangeTextMock).toBeCalledWith("text")
    expect(refineMock).toBeCalledWith("text")
  })

  it("track event when the text is changed", () => {
    const { getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)

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
})

const defaultProps: SearchInputProps = {
  placeholder: "Placeholder",
  currentRefinement: "refinement",
  refine: jest.fn(),
  onReset: jest.fn(),
  onTextChange: jest.fn(),
}
